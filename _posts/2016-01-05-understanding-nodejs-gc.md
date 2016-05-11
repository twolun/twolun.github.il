---
layout: post
title: 深入理解Node.js中的垃圾回收和内存泄漏的捕获
category: technique
---

对于Node.js而言，通常被抱怨最多的是它的性能问题。当然这并不意味着Node.js在性能方面就比其他技术表现的都更差，
因此开发者有必要清晰的理解Node.js是具体如何工作的的。由于这个技术有一个非常扁平的学习曲线，
如果要跟踪Node.js的运行，通常都比较复杂，因此你需要提前理解它的运行机制，从而避免可能存在的性能损失。一旦出现了问题，
你需要尽快的定位它并进行修复。本文主要介绍了如何管理Node.js应用的内存，以及如何向下追踪与内存相关的问题。

<!--more-->

## Statement

> 原文地址：http://apmblog.dynatrace.com/2015/11/04/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js/

## Node.js内存管理

不同于PHP这样的平台，Node.js应用是一个一直运行的进程。虽然这种机制有很多的优点，例如在配置数据库连接信息时，
只需要建立一次连接，便可以让所有的请求进行复用该连接信息，但不幸的是，这种机制也存在缺陷。
但是，首先我们还是来了解一些Node.js基本知识。

### Node.js是一个由JavaScript V8引擎控制的C++程序

[Google V8](https://developers.google.com/v8/)是一个由Google开发的JavaScript引擎，但它也可以脱离浏览器被单独使用。
这使得它能够完美的契合Node.js，实际上V8也是Node.js平台中唯一能够理解JavaScript的部分。
V8会将JavaScript代码向下编译为本地代码（native code），然后执行它。在执行期间，V8会按需进行内存的分配和释放。
这意味着，如果我们在谈论Node.js的内存管理问题，也就是在说V8的内存管理问题。

你可以参考[这个链接](https://developers.google.com/v8/get_started)来了解如何从C++的角度使用V8。

### V8的内存管理模式

一个运行的程序通常是通过在内存中分配一部分空间来表示的。这部分空间被称为驻留集（Resident Set）。
V8的内存管理模式有点类似于[Java虚拟机（JVM）](http://wwsun.github.io/posts/jvm-gc.html)，它会将内存进行分段：

- 代码 Code：实际被执行的代码
- 栈 Stack：包括所有的携带指针引用堆上对象的值类型（原始类型，例如整型和布尔），以及定义程序控制流的指针。
- 堆 Heap：用于保存引用类型（包括对象、字符串和闭包）的内存段

![v8 memory scheme](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-v8-memory-scheme.png)

在Node.js中，当前的内存使用情况可以轻松的使用[`process.memoryUsage()`](https://nodejs.org/api/process.html#process_process_memoryusage)进行查询，
实例程序如下：

	var util = require('util');

	console.log(util.inspect(process.memoryUsage()));

这将会在控制台产生如下结果：

	{ 
		rss: 4935680,
		heapTotal: 1826816,
		heapUsed: 650472
	}

`process.memoryUsage()`函数返回的对象包含：

- 常驻集的大小 - rss
- 堆的总值 - heapTotal
- 实际使用的堆 - heapUsed

我们可以利用这个函数来记录不同时间的内存使用情况，并利用这些数据绘制成一张图从而更清晰的展示V8是如何处理内存的。

![node.js memory usage](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-v8-memory-usage.png)

图中最顶端的橙色线条为RSS（驻留集大小），接下来红色线条表示堆的总值，表现的最为不稳定的部分是黄色线条，
它所表示的是已使用的堆的大小，虽然线条不停的抖动，但总是维持在一定的边界值内保持一个稳定中位数。
分配和回收堆内存的机被称为垃圾回收（Garbage Collection）。

## 垃圾回收

每个需要消耗内存的程序都需要某种机制来预约和释放内存空间。在C和C++程序中，程序可以通过`malloc()`和`free()`
这两个函数来申请和释放内存。我们发现，这需要由程序员负责释放不再使用的堆内存空间。如果一个程序所分配的内存不再使用了，
却没有被及时释放的话，那么逐渐累积会导致程序对堆空间的消耗越来越大，直至耗尽整个堆空间，此时会导致程序崩溃。
通常我们称这种情况为内存泄漏（memory leak）。

前面我们已经了解到，Node.js的JavaScript代码会通过V8编译为本地代码（Native Code）。
显然最终的原始数据结构已经和最初的表示没有太多的关系了，它完全由V8来进行管理。这说明，
在JavaScript中，我们并不能主动的进行内存的分配和回收操作。V8使用了著名的被称为“***垃圾回收***”的机制来自动解决这个问题。

垃圾回收背后的理论非常的简单：如果内存段不再被其他地方引用，我们便可以假设它已经不再被使用，因此，就可以释放这片内存段。
然而， 检索和维护这些信息是非常复杂的，因为这可能会涉及到引用之间的相互链接，从而形成一个复杂的图结构。

![A Heap Graph](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-memory-heap-graph.png)

在上面的堆图中，如果红色的对象不再有引用指向它的话，那么该对象就可以被丢弃（释放内存）。

垃圾回收是个代价非常高的进程，因为它会中断程序在执行，从而影响程序的性能。为了补救这种情况，V8使用了两种类型的垃圾回收：

- Scavenge（提取），速度快但不彻底
- Mark-Sweep（标记-清除），相对慢一点，但是可以回收所有未被引用的内存

你可以通过[这篇博文](http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection)深入的了解更多关于V8垃圾回收的内容。

重新回顾我们利用`process.memoryUsage()`方法收集到的数据，我们可以很简单的就识别出不同的垃圾回收类型：
成锯齿状（saw-tooth pattern）是由Scavenge创建的，而出现向下跳跃的则是由Mark-Sweep操作产生的。

通过使用原生模块[node-gc-profiler](https://github.com/bretcope/node-gc-profiler)，我们可以收集更多关于垃圾回收的信息。
该模块会订阅由V8触发的所有垃圾回收事件，并将它们暴露给JavaScript。

返回的对象表示了垃圾回收的类型和持续时间。再一次的，我们可以轻松的利用可视化图形来更好的理解它是如何工作的。

![duration and ferquency of gc runs](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-duraction-and-frequency-of-gc-runs.png)

我们可以发现Scavenge Compact运行的比Mark Sweep更为频繁。根据应用的复杂程度这可能会存在一定的变化。
有意思的是，上面的图形也展现了频繁却非常短的Mark-Sweep运行状况，这也跟运行的函数有关。

### 如果出了故障

既然有垃圾回收器来负责内存清理，那么为什么我们还需要关心这个呢？事实上，这仍然会有可能发生内存泄漏，
你的日志记录可能会记录这些信息。

![exception caused by memory leak](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-memory-leak.png)

当内存泄漏出现的时候，内存可能会出现堆积的情况，如图所示。

![memory leak in progress](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-memory-leak-in-progress.png)

垃圾回收（GC）机制会尽可能的回收内存，但是每次运行GC都会导致一定的损耗。我们发现在上图中，堆内存的使用处于一个不断攀升的过程，
这通常意味着内存泄漏的发生。使用这些信息，我们能够较为方便的判断是否出现了内存泄漏，
下面我们进一步的探索如何在内存泄漏发生的是去向下最终问题的源头。

### 问题追踪和解决

有些泄漏的发生是显而易见的，例如将数据存储在全局变量中，例如将每次访问用户的IP信息都存放在一个数组中。
而有些问题则是不易察觉的，例如著名的[沃尔玛内存泄漏](https://www.joyent.com/blog/walmart-node-js-memory-leak)事件,
它是由于Node.js核心代码中一个非常细微的声明缺失导致的，这可能需要花费数周的事件才能追踪到。

在这里我并不会覆盖核心的代码错误。而是来看一个难以追踪的内存泄漏案例，通过这个例子能够让你在自己的JavaScript代码中定位错误，
这个例子来源于[Meteor的博客](http://info.meteor.com/blog/an-interesting-kind-of-javascript-memory-leak)。

![introducing a leak into your own javascript code](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-leak-example.png)

这段代码刚看到的时候并没有发现有什么问题。我们可以认为`theTing`在每次调用`replaceThing()`的时候都会被覆写。
问题就是`someMethod`拥有作为上下文的封闭作用域。这意味着`unused()`是在`someMethod()`内部的，甚至`unused()`从未被调用过，
这也就以为了垃圾收集器无法释放`originalThing`。有非常多的间接方法需要遵守。这在代码中并非是bug，但它会导致内存泄漏，
并且难以追踪。

因此如果我们能够进入堆内存，并且观察它实际包含的内容，这会非常有助于我们最终错误源。幸运的是，我们可以这么做！
V8提供了一种方法用于转储（导出）当前的堆，并且v8-profiler将它用JavaScript接口的形式暴露了出来。

如果内存使用持续攀升的话，这个简单的模块可以创建了堆的转储文件。当然，也有其他更巧妙的方法来探测类似的问题，
但对于我们的当前任务而言，这就足够了。如果存在内存泄漏，程序会中断，并且伴随着大量的类似文件。
因此你可以通过为这个模块关闭和增加一些提示工具的方式来模拟。在Chrome中也提供了类似的堆空间转储功能，
并且你可以直接通过Chrome开发者工具来分析v8-profiler的转储文件。

![v8-profiler in chrome](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-v8-profiler-in-chrome.png)

单一的堆转储可能并不能帮助你，因为它不能展示堆随着时间变化的增长过程。这就是为什么Chrome开发者工具允许你对比不同的内存概况文件。
你可以通过比较两个专注文件来获得差值，这样可以让你观察到内存占用的变化情况。如下图所示：

![heap dump comparison](http://7xpv9g.com1.z0.glb.clouddn.com/img160105-heap-dump-comparison.png)

这里能够看到一些问题所在，`longStr`变量包含着一些星号组成的字符串，并且被`originalThing`所引用，并且也被一些方法所引用，
然后也被……当然，你能看意识到这点。这里有一个非常长的引用路径，闭包上下文会导致`longStr`长期占用内存，并且得不到释放。

虽然这个问题导致了一个显而易见的问题，但是定位问题的过程总是相似的：

1. 不定时的创建堆的转储文件
2. 进行不同文件的对比，从而定位问题所在

## 总结

正如我们所看到的，垃圾收集是个非常复杂的过程，并且即使代码没有问题也有可能会导致内存泄漏。
通过使用v8（和chrome开发者工具）提供的一些开箱即用的功能，能够帮助我们定位问题的源头，
如果你将这种机制构建到你的应用内，这将会非常有助于你发现和修复问题。

当然，如果你问我上面的代码如何修复，其实非常的简单，只要在函数的最后加上一行`theThing = null;`即可。