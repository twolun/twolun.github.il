---
layout: post
title: 深入浅出Koa（1）：生成器和Thunk函数
category: technique
---

[Koa](http://koajs.com/)是个小而美的Node.js web框架，它由[Express](http://expressjs.com/)的原班人马打造的，
致力于以一种现代化开发的方式构建[web应用](https://blog.risingstack.com/shipping-node-js-applications-with-docker-and-codeship/)。
通过这个系列，你将能够理解Koa的基本原理，并且学习如何正确有效的使用Koa编写Web应用程序。本文主要向你介绍
Koa的一些基础知识，包括生成器，thunks等。

<!--more-->

## 为什么要用Koa?

Koa提供的一些关键特性能够让你尽可能避免回调函数的情况下简单快捷的编写web应用。Koa使用了ES6中的一些新的语言
特性来让Node应用的控制流管理变得更加简单。

Koa本身非常的小。与当下其他流行的web框架（例如Express）不同的是，Koa从一出生开始就采用了一种极致模块化的方案，
意味着每个模块做且只做一件事情。请牢记这一点，让我们开始吧。

## Hello Koa

	var koa = require('koa');  
	var app = koa();
	
	app.use(function *() {  
		this.body = 'Hello World';
	});
	
	app.listen(3000);  
	
在开始之前，为了能够用node运行本文中的例子或你自己写的ES6代码
（如果你使用的是`node v4`以下版本，则需要加上`--harmony`，建议你升级到Node的最新版本）。

正如你从上面的例子中看到的那样，使用Koa来编写一个web服务器并没有什么特别的地方，除了那个奇怪的跟在`function`
关键字后的`*`符号。好吧，如果你了解ES6的话，我想你应该知道这个符号意味着该函数现在是**生成器函数**了。

### 生成器 Genderators

> 想象这样的一个场景，当你执行一个函数的时候，你可以在某个点暂停函数的执行，做一些其它工作，计算一些其他值，
然后返回到函数，甚至是携带一些新的值继续函数的执行。

可以认为生成器就是某种迭代器（类似于循环）。当然，这也是生成器函数最擅长做的事，生成器是ES6的新特性。因此我们可以自由的使用它。

我们来试着使用一下生成器！首先，你得创建一个生成器函数，这与我们创建普通函数没有太大的差别，唯一的区别在于，
在`function`关键字后面需要添加`*`符号。例如：

	function *foo() { }
	
如上，现在我们就创建了一个生成器函数。当我们调用这个函数时，它会返回一个**迭代器对象**。因此与一般函数不同的是，
当我们调用一个生成器时，代码并不会立即执行，正如我们前面所讨论的，我们需要手动的迭代这个迭代器对象。

	// 生成器函数
	function *foo(arg) {
		
	}
	
	var bar = foo(123); // bar为迭代器对象

使用这个返回对象`bar`，我们可以用来遍历函数中的中断点。可以通过调用迭代器对象`bar`的`next()`方法来完成遍历操作。
当`next()`被调用的时候，函数会从之前暂停的地方执行到下一个暂停点。

但是在继续执行之前，迭代器会返回一个对象，这个对象包含了生成器的的状态信息（即每次调用`next()`方法时会返回一个对象）。
这个对象包含两个属性，分别是`value`和`done`。`value`表示当前迭代值，`done`则表示的是迭代是否结束。

	function *foo(args) {
		return args;
	}
	
	var bar = foo(123);
	bar.next(); // {value: 123, done: true}
	
正如我们所看到的那样，这个生成器函数中并没有任何的中断点（没有`yield`关键字），
因此首次调用`next()`方法时返回对象的`done`值为`true`。这意味着，如果你在生成器函数中指明了`return`值，
它将会被作为最后一个迭代器对象被返回（也就是`done`为`true`）。现在，我们唯一需要所做的是能够暂停迭代器。
正如前面说的那样，在迭代遍历生成器函数时，每次迭代会产出一个值（在暂停点）。
因此，ES6使用`yield`关键字用于暂停函数。

### yield

	yield [[expression]]

我们知道，我们可以通过`next()`方法来启动一个生成器，每当遇到一个`yield`关键字时，它会暂停执行。
然后返回一个包括`value`和`done`属性的对象。此时`value`值即为`yield`后的表达式结果。
当然，这个表达式可以是任何表达式。例如：

	function *foo() {
		var index = 0;
		while (index < 2) {
			yield index++;
		}
	}
	
	var bar = foo();
	
	console.log(bar.next());    // { value: 0, done: false }  
	console.log(bar.next());    // { value: 1, done: false }  
	console.log(bar.next());    // { value: undefined, done: true }
	
再次调用`next()`方法，当前的`yield`值会被返回，然后继续执行。当然，如果你要在`next()`方法中接收一个值，
例如`next(val)`这样，也是可以的，接收的值会在生成器继续执行时被返回。

	function *foo() {
		var val = yield 'A';
		console.log(val);		// 'B'
	}
	var bar = foo();
	
	console.log(bar.next());	// {value: 'A', done: false}
	console.log(bar.next('B');	// {value: undefined, done: true}
	
再次解释一下：第一次调用`bar.next()`方法时，生成器对象执行到`yield 'A'`，然后返回`{value: 'A', done: false}`，
value的值即为`yield`后表达式的值，done表示是否结束。再次调用`bar.next('B')`，此时已经没有了`yield`语句，
或者`return`语句，因此返回对象的value值为`undefined`。但是因为`next()`方法接收了一个值`B`，
因此该值会赋值给`val`。
	
### 错误处理

如果你发现迭代器对象的值发生了错误的话，你可以使用`throw()`方法在生成器中捕获错误。
使用这种方法，你可以轻松的在生成器完成错误处理的任务。

	function *foo() {
		try {
			x = yield 'asd B'; // Error will be thrown
		} catch(err) {
			throw err;
		}
	}
	
	var bar = foo();
	if (bar.next().value == 'B') {
		bar.throw(new Error("it's B!"));
	}

### for...of

在ES6中有一个新的循环类型，可以被用来迭代生成器对象，它就是`for...of`循环。
使用`for...of`循环时，迭代会一直执行到`done`为`false`时。值得注意的是，如果你使用了这种循环类型，
那么你将不能在`next()`方法中传值，并且循环会舍弃返回值。

	function *foo() {
		yield 1;
		yield 2;
		yield 3;
	}
	
	for (v of foo()) {
		console.log(v);
	}

### yield *

前面说过，你可以`yield`几乎任何东西，甚至是生成器。如果你需要`yield`一个生成器的话，那么需要使用`yield *`。
这被称为生成器委托（delegation）。这意味着你正在委托给另一个生成器，因此，
你可以使用一个迭代器对象迭代遍历多重嵌套的生成器。

	function *bar () {  
		yield 'b';
	}
	
	function *foo () {  
		yield 'a'; 
		yield *bar(); // bar()返回一个生成器（迭代器）
		yield 'c';
	}
	
	for (v of foo()) {  
		console.log(v);
	}

### Thunks

如果要彻底理解Koa，Thunk是另一个需要搞懂的重要概念。Thunk函数是一个偏函数，执行它会得到一个新的只带一个回调参数的函数。
某种程度上，我们可以将它与[lazy evaluation](http://www.wikiwand.com/zh-cn/%E6%83%B0%E6%80%A7%E6%B1%82%E5%80%BC)联系在一起。
我们来看一下例子：

	var read = function(file) {
		return function(cb) {
			require('fs').readFile(file, cb);
		}
	}
	
	read('package.json')(function (err, str){});

上面的示例代码中，`read`函数时一个典型的Thunk函数，执行`read('package.json')`后我们可以获得一个只有回调参数的新函数。

### Thunkify
	
我们可以利用一个叫[thunkify](https://github.com/visionmedia/node-thunkify)小模块，
将普通的node函数转换为thunk函数。你可能会问，我们为什么需要这么做？因为我们在使用生成器函数，
事实证明，它可以让你轻松的在生成器函数中避免使用回调函数。

为了能够在生成器函数中试用thunk函数，我们首先需要做的是将原先的含回调的普通node函数转为thunk函数。
如果不这样做，我们就必须使用回调来进行处理。当我们调用`next()`方法时，此刻返回的value值是一个函数，
该函数的参数是一个被thunk化的函数的回调。在回调函数中，我们可以检查错误（使用`throw`关键字），
或者调用`next()`方法获取接收到的数据。


	var thunkify = require('thunkify');
	var fs = require('fs');
	var read = thunkify(fs.readFile);  // 1
	
	// 2
	function *bar() {
		try {
			var x = yield read('input.txt');
		} catch(err) {
			throw err;
		}
		
		console.log(x);
	}
	
	var gen = bar(); // 3
	gen.next().value(function (err, data) {  // 4
		if (err) gen.throw(err);
		gen.next(data.toString());
	});
	
解释一下上面的执行流程：

1. 我们利用`thunkify`模块将原生方法`fs.readFile`转为thunk化后的`read()`函数。
注意！`read()`函数是个thunk函数。
2. 定义一个生成器函数，`yield`后的是一个thunk化的`read()`函数。
3. 调用这个生成器函数，将返回的迭代器对象赋值给`gen`。
4. 调用`next()`方法，返回的value值是一个函数，该函数接收一个callback，这个callback其实就是被thunk化的
`read()`函数的callback。我们可以利用这个callback来执行处理。

你需要花点时间来理解上面代码中的每一个部分，因为这对于理解Koa非常的关键。希望你能更多的关注到代码中的生成器部分。
它拥有同步代码的简洁性，使用了合理的错误处理，但是需要注意的是，它仍然是异步代码。

本文是Koa系列的第一篇，后面还会继续介绍Koa。

## Statement

> 原文地址： https://blog.risingstack.com/introduction-to-koa-generators/

## References

1. https://blog.risingstack.com/introduction-to-koa-generators/
1. http://purplebamboo.github.io/2014/05/24/koa-source-analytics-1/