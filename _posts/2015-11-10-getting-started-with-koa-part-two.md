---
layout: post
title: 深入浅出Koa（2）：co的实现和使用
category: technique
---

在[之前的文章](http://wwsun.github.io/posts/getting-started-with-koa-part-one.html)中，
我们介绍了Koa的基础知识，主要涉及了ES6生成器的相关知识，借助于生成器，我们可以使用同步风格的代码编写异步代码，
这么做可以让异步编程变得更加简单，也让代码更可读，本文我们将要介绍的是`co`，它是Koa的实现基础。

<!--more-->

## 简单回顾

	// First part
	var thunkify = require('thunkify');  
	var fs = require('fs');  
	var read = thunkify(fs.readFile);
	
	// Second part
	function *bar () {  
		try {
			var x = yield read('input.txt');
		} catch (err) {
			console.log(err);
		}
		console.log(x);
	}
	
	// Third part
	var gen = bar();  
	gen.next().value(function (err, data) {  
		if (err) {
			gen.throw(err);
		}
		
		gen.next(data.toString());
	});

这是前一篇文章中的最后一个例子，正如你看到的那样，我们可以将程序分为三个重要部分。
首先，我们需要创建了一个被thunk化的函数，我们将在生成器中使用到这个thunk函数。
然后，我们可以编写我们的生成器函数，并在函数中使用前面创建的thunk函数。
最后，我们调用并遍历生成器，并进行错误处理等工作。如果你仔细的考虑了这个过程，
你会发现最后一个部分和整个程序的核心内容并没有太大的关联。它只不过是用来让我们运行生成器而已。
因此，我们可以利用一个工具来简化这个过程，幸运的是，正好有一个这样的模块，他就是co。

## co

[Co](https://github.com/tj/co)是一个基于生成器的Node流程控制模块。下面的例子所做的工作与前一个例子完全一样，
但是我们没有直接编写调用生成器的代码（上面代码的第三部分）。取而代之的是，我们将生成器直接传递给了`co`函数，
然后立即调用这个函数，任务就这么神奇的完成了。其实，也没什么神奇的，`co`只不过是帮你完成了生成器调用代码而已，
因此我们没必要担心下层的工作。

	var co = require('co');
	var thunkify = require('thunkify');
	var fs = require('fs');
	
	var read = thunkify(fs.readFile);
	
	co(function *bar() {
		try {
			var x = yield read('input.txt','utf-8');
		} catch (err) {
			console.log(err);
		}
		console.log(x);
	}).catch(onerror);
	
	function onerror(err) {
		console.error(err.stack);
	}
	
正如你已经知道的那样，你可以在`yield`后面跟上任何你需要计算（用于获取某些值、执行某些任务）的表达式。因此，
不仅仅是thunk函数可以跟在`yield`后面。由于`co`主要用来创建更简单的控制流，因此它只能用来`yield`一些特定类型。
目前主要可以在`co`中被`yield`的类型有：

- thunks（函数）
- 数组（并行执行）
- 对象（并行执行）
- 生成器（代理）
- 生成器函数（代理）
- Promises

前面我们已经讨论了thunks是如何工作的，因此下面我们来讨论一些其他内容。

## co的简单实现

co的异步解决方案主要建立在Thunk函数的基础上。使用co时，`yield`后的表达式经常是Thunk函数。
前面的文章中，我们已经介绍过，你可以借助诸如`thunkify`这样的模块来包裹原来的函数。
有了co后，我们可以使用这样的方式来进行异步编程：

	let co = require('co'); // 这里使用的是4.0之前的版本，4.0后开始使用promise风格
	let thunkify = require('thunkify');
	let fs = require('fs');
	let size = thunkify(fs.stat);

	co(function *() {
		let a = yield size('file1.txt');
		let b = yield size('file2.txt');
		
		console.log(a);
		console.log(b);
		
		return [a, b];
	})(function (err, values){
		if (err) throw err;
		
		console.log("----------");
		console.log(values);
	});
	
程序的输出结果大概是这样的：

	12
	33
	----------
	[ 12, 33 ]

在上面的代码中，我们使用`yield`来直接获取异步函数`size()`的值，但代码简直和同步代码没什么两样。
这样做的好处是，让我们不再关心回调函数可能引发的回调抵御问题。实际上，co本质上也可以看成是一个Thunk函数，
它接收了一个生成器函数作为参数，并生成了一个实际操作函数，而这个函数正是通过接收回调的方式来传入最后的返回值。

下面我们来看下如何实现一个最简单的co：

	let co = function (callback) {
		return function (done) {
			let ctx = this;
			let gen = callback.call(ctx);
			let it = null;
			
			function _next(err, res) {
				it = gen.next(res);
				if (it.done) {
					done.call(ctx, err, it.value);
				} esle {
					it.value(_next);	
				}
			}	
			_next();
		}
	}

我们说过，co本质上也是一个Thunk函数，它需要传入一个生成器函数，它能够帮你不停的调用所传入生成器的`next`函数，
如果`done`微`true`，则代表生成器函数已经迭代完成，并将值传给回调函数。这里需要注意`_next`函数的实现，
它实际上会成为前面的`yield`的函数的回调函数。

比如之前的代码中的`size('file1.txt')`会返回一个带回调的函数`a`。这里有个约定，
就是Thunk函数的回调一般都是`function (err,res) { }`的格式，实际上这也是node实际的规范。

上面我们实现了一个简单的co函数，已经可以支持最基本的同步调用了，但很多时候，我们还需要在`yield`后面处理其他的值，
比如一个数组或者对象，我推荐你阅读[这篇博文](http://purplebamboo.github.io/2014/05/24/koa-source-analytics-2/)。
当然，最重要的还是阅读co的[源码](https://github.com/tj/co)。

## co v4使用指南

下面看完了co的源码，我们来看看如何使用co，它的最新版本是`v4`，这个版本主要依赖于promise。

### 并行执行

	co(function *() {
		// 3 concurrent reads
		var reads = yield [
			read('input.txt', 'utf-8'),
			read('input.txt', 'utf-8'),
			read('input.txt', 'utf-8')
		];
		console.log(reads);
		
		// 2 concurrent reads
		reads = yield {a: read('input.txt', 'utf-8'), b: read('input.txt', 'utf-8')};
		console.log(reads);
	}).catch(onerror);
	
如果你`yield`了一个数组或对象，它会并行的计算数组或对象中的内容。当然，如果集合中的内容为thunks或生成器，
它也能同样进行处理。并且你也可以进行嵌套，它能够便利你的数组或对象，然后并行的执行工作函数。需要记住的是:
`yield`后的生成的结果并不是扁平的，而是保持和原来相同的结构。

	co(function *() {
	
		var a = [read('cinq.txt', 'utf-8'), read('deux.txt', 'utf-8')];
		var b = [read('six.txt', 'utf-8'), read('un.txt', 'utf-8')];
		
		var files = yield [a, b];
		console.log(files); // [ [ 'cinq', 'deux' ], [ 'six', 'un' ] ]
	
	}).catch(onerror);
	
你也可以在thunk调用后进行`yield`，同样能达到并行的目的。
	
	co(function *() {  
		var a = read('input.txt', 'utf-8');
		var b = read('input.txt', 'utf-8');
		
		// 2 concurrent reads
		console.log([yield a, yield b]);
		
		// or
		
		// 2 concurrent reads
		console.log(yield [a, b]);
	}).catch(onerror);
	
### 委托

前面说过，你也可以在`yield`后面跟上生成器。注意你可以不必使用`yield *`;

	var stat = thunkify(fs.stat);
	
	function *size(file) {
		var s = yield stat(file);
		return s.size;
	}
	
	co(function *() {
		var f = yield size('input.txt'); // hello world
		console.log(f); // 11
	}).catch(onerror);
	
我们大致尝试用`co`处理了每一种可以被yield的类型。下面我们来看最后一个例子，算作总结。

	var co = require('co');
	var fs = require('fs');
	
	function size(file) {
		return function (fn) {
			fs.stat(file, function (err, stat) {
			if (err) return fn(err);
			fn(null, stat.size);
			});
		}
	}
	
	function *foo() {
		var a = yield size('un.txt');
		var b = yield size('deux.txt');
		var c = yield size('trois.txt');
		return [a, b, c];
	}
	
	function *bar() {
		var a = yield size('quatre.txt');
		var b = yield size('cinq.txt');
		var c = yield size('six.txt');
		return [a, b, c];
	}
	
	co(function *() {
		var results = yield [foo(), bar()];
		console.log(results);
	}).catch(onerror);
	
	function onerror(err) {
		console.error(err.stack);
	}
	
我想目前为止你应该能够对生成器有了一个较为清晰的认识了，并且能够借用`co`很好的处理异步控制流。关于`co`本身，
如果你想了解的更深入些，可以阅读它的[源代码](https://github.com/tj/co)。现在，我们将重点移到Koa本身上来。

## 小结
	
本文为你介绍了Koa的实现基础co，它能够让你的node应用避免回调地狱。后面我们会继续介绍Koa的使用与实现。

## Statement

> 原文地址：https://blog.risingstack.com/getting-started-with-koa-part-2/

## References

1. [Koa的一些例子](https://github.com/koajs/examples)
2. [中间件列表](https://github.com/koajs/koa/wiki)
3. [Wiki](https://github.com/koajs/koa/wiki)java
4. [Koa最佳实践指南](https://github.com/koajs/koa/blob/master/docs/guide.md)