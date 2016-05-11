---
layout: post
title: 异步JavaScript的发展历程
category: technique
---

对大部分的JavaScript开发者而言，`async`函数是个新鲜事物，它的发展经历了一个漫长的旅程。因此本文试图
梳理总结JavaScript异步函数的发展历程：在不久之前，我们还只能写回调函数来实现异步，然后Promise/A+
标准出来了，这之后又出现了生成器函数，而未来显然是`async`函数的。

现在让我们、一起来回顾这些年来JavaScript异步函数的发展历程吧。

<!--more-->
## Statement

> 未经允许，请勿转载。原文地址：https://blog.risingstack.com/asynchronous-javascript/

## 回调函数 Callbacks

似乎一切应该从[回调函数](https://blog.risingstack.com/node-js-best-practices/)开始谈起。

### 异步JavaScript

正如我们所知道的那样，在JavaScript中，异步编程方式只能通过JavaScript语言中的一等公民函数才能完成：
这种方式意味着我们可以将一个函数作为另一个函数的参数，在这个函数的内部可以调用被传递进来的函数（即回调函数）。
这也正是回调函数诞生的原因：如果你将一个函数作为参数传递给另一个函数（此时它被称为高阶函数），那么在函数内部，
你可以调用这个函数来来完成相应的任务。回调函数没有返回值（不要试图用`return`），仅仅被用来在函数内部执行某些动作。
看一个例子：

```javascript
const fs = require('fs')

console.log('start reading a file...')

fs.readFile('file.md', 'utf-8', function (err, content) {  
  if (err) {
    console.log('error happened during reading the file')
    return console.log(err)
  }

  console.log(content)
})

console.log('end of the file')  
```

输出结果是：

```bash
start reading a file...  
end of the file  
error happened during reading the file  
```
	
上面的例子中我们演示了一个错误优先的回调函数（error-first callbacks），这也是Node.js本身的特点之一，
Node.js中所有的核心模块和NPM仓库中的大部分模块在编写时都会遵循这个特点。

简单总结一下在Node.js中使用回调函数进行编程点特点：

- **错误优先**
- **没有返回值**: 异步函数没有返回值，值将会被传递给回调函数。

过度使用回调函数所会遇到的挑战：

- 如果不能合理的组织代码，非常容易造成回调地狱（callback hell），这会使得你的代码很难被别人所理解。
- 很容易遗漏错误处理代码
- 无法使用`return`语句返回值，并且也不能使用`throw`关键字

也正是基于这些原因，在JavaScript世界中，一直都在寻找着能够让异步JavaScript开发变得更简单的可行的方案。

一个可行的解决方案之一是[async](https://www.npmjs.com/package/async)模块。如果你和回调函数打过很久的交道，
你也许会深刻的感受到，在JavaScript中如果想要让某些事并行执行，或是串行执行，甚至是使用异步函数来映射（mapping）
数组中的元素使用异步函数有多复杂。所以，感谢[Caolan McMahon](https://twitter.com/caolan)写了async模块来
解决这些问题。

使用`async`模块，你可以轻松像下面这样的方式编写代码：

	async.map([1, 2, 3], AsyncSquaringLibrary.square,  
		function(err, result){
			// result will be [1, 4, 9]
	});	
	
async模块虽然一定程度上带来了便利，但仍然不够简单，代码也不容易阅读，因此Promise出现了。

## Promise

当前的JavaScript异步标准可以追溯到2012年，并且直到ES6才变得可用，然而，Promise这个术语却并不是JavaScript
社区所发明的。这个术语来来自于[Daniel P.friedman](https://en.wikipedia.org/wiki/Daniel_P._Friedman)
在1976年的发表的一篇文章。

**一个Promise代表的是一个异步操作的最终结果。**

现在我们使用Promise来完成上面代码所完成的任务，Promise风格的代码如下：

	Something.save()  
		.then(function() {
			console.log('success');
		})
		.catch(function() {
			//error handling
		})
		
你会发现，Promise中也利用了回调函数。在`then`和`catch`方法中都传入了一个回调函数，分别在Promise被
满足和被拒绝时执行。Promise函数的另一个优点是它能够被链接起来完成一系列任务。例如，你可以这样写代码：

	saveSomething()  
		.then(updateOtherthing)
		.then(deleteStuff)  
		.then(logResults);
		
当你没有现成的Promise时，你可能需要借助一些Promise库，一个流行的选择是使用[bluebird](https://github.com/petkaantonov/bluebird)。
这些库可能会提供比原生方案更多的功能，并且不局限于Promise/A+标准所规定的特性。

但是你为什么不用糖方法（sugar methods）呢？建议你首先阅读[Promise: The Extension Problem](http://blog.getify.com/promises-part-4/)
这篇文章。更多关于Promise的信息，可以参考[Promise/A+标准](https://promisesaplus.com/)。

你可能会问： 如果大部分的库只暴露了回调的接口的话，那么我该如何使用Promise？
嗯，这个很简单，此时你唯一需要做的就是使用Promise来包裹含有回调的那个函数调用体。举例说明：

回调风格的代码可能是这样的：

	function saveToTheDb(value) {
		db.values.insert(value, function (err, user) {
			if (err) throw err;
			
			// todo: insert user to db
		});
	}

现在我们来将其改成支持Promise风格调用的代码：

	function saveToTheDb(value) {  
		return new Promise(function(resolve, reject) {
			db.values.insert(value, function(err, user) { // remember error first ;)
				if (err) {
					return reject(err); // don't forget to return here
				}
				resolve(user);
			})
		}
	}
	
已经有相当一部分的库或框架同时支持者两种方式了，即同时提供了回调风格和Promise风格的API接口。那么现在，
如果你也想对外提供一个库，最佳实践也是同时提供两种方式的接口。你可以轻松的使用如下方式来达到这个目的：

	function foo(cb) {  
		if (cb) {
			return cb();
		}
		
		return new Promise(function (resolve, reject) {
		
		});
	}

或者更简单些，你可以从只提供Promise风格的接口开始后，并使用诸如[callbackify](https://www.npmjs.com/package/callbackify)
这样的工具来达到向后兼容的目的。其实Callbackify所做的工作和上面的代码片段类似，但在实现上使用了一个更通用的方法，
我建议你可以去阅读Callbackify的源代码。

## 生成器Generators/ yield

JavaScript[生成器](https://blog.risingstack.com/introduction-to-koa-generators/)是个相对较新的概念，
它是ES6（也被称为ES2015）的新特性。想象下面这样的一个场景：

> 当你在执行一个函数的时候，你可以在某个点暂停函数的执行，并且做一些其他工作，然后再返回这个函数继续执行，
甚至是携带一些新的值，然后继续执行。

上面描述的场景正是JavaScript生成器函数所致力于解决的问题。当我们调用一个生成器函数的时候，它并不会立即执行，
而是需要我们手动的去执行迭代操作（`next`方法）。也就是说，你调用生成器函数，它会返回给你一个迭代器。迭代器
会遍历每个中断点。

	function* foo () {  
		var index = 0;
		while (index < 2) {
			yield index++; //暂停函数执行，并执行yield后的操作
		}
	}
	var bar =  foo(); // 返回的其实是一个迭代器
	
	console.log(bar.next());    // { value: 0, done: false }  
	console.log(bar.next());    // { value: 1, done: false }  
	console.log(bar.next());    // { value: undefined, done: true }  
	
更进一步的，如果你想更轻松的使用生成器函数来编写异步JavaScript代码，我们可以使用[co](https://www.npmjs.com/package/co)
这个库，co是著名的tj大神写的。

> Co是一个为Node.js和浏览器打造的基于生成器的流程控制工具，借助于Promise，你可以使用更加优雅的方式编写非阻塞代码。

使用`co`，前面的示例代码，我们可以使用下面的代码来改写：

	co(function* (){  
		yield Something.save();
	}).then(function() {
		// success
	})
	  .catch(function(err) {
		//error handling
	});
	
你可能会问：如何实现并行操作呢？答案可能比你想象的简单，如下（其实它就是`Promise.all`而已）：

	yield [Something.save(), Otherthing.save()];  
	
## Async/ await

在ES7（还未正式标准化）中引入了Async函数的概念，目前如果你想要使用的话，只能借助于[babel](http://babeljs.io/)
这样的语法转换器将其转为ES5代码。(提醒一点：我们现在讨论的是`async`关键字，而不是NPM中的async包)。

简而言之，使用`async`关键字，你可以轻松的达成之前使用生成器和`co`函数所做到的工作。当然，除了hack之外。

也许你会问，是否在ES7中有了`async`关键字，`yield`就变得不是那么重要了？

实际上，使用`yield`实现异步也不过是一种hack罢了，`yield`意味着懒次序(lazy sequences)和迭代器。
而`await`能够完美的分离这两点，首先让`yield`用于其最初的目的，其次使用`await`来执行异步操作。

在这背后，`async`函数实际使用的是Promise，也就是为什么async函数会返回一个Promise的原因。

因此，我们使用`async`函数来完成类似于前面代码所完成的工作，可以使用下面这样的方式来重新编写代码：

	async function save(Something) {  
		try {
			await Something.save(); // 等待await后面的代码执行完，类似于yield
		} catch (ex) {
			//error handling
		}
		console.log('success');
	} 
	
正如你看到的那样，使用async函数，你需要在函数声明的最前面加上`async`关键字。这之后，你可以在
函数内部使用`await`关键字了，作用和之前的`yield`作用是类似的。

使用`async`函数完成并行任务与`yiled`的方式非常的相似，唯一不同的是，此时`Promise.all`不再是
隐式的，你需要显示的调用它：

	async function save(Something) {  
		await Promise.all[Something.save(), Otherthing.save()]
	}

Koa也支持`async`函数，如果你也在使用koa，那么你现在就可以借助`babel`使用这一特性了。

	import koa from koa;  
	let app = koa();
	
	app.experimental = true;
	
	app.use(async function (){  
		this.body = await Promise.resolve('Hello Reader!')
	})
	
	app.listen(3000);  
	
## 拓展阅读

1. [Hapi with generators](https://blog.risingstack.com/hapi-on-steroids-using-generator-functions-with-hapi/)
2. [Koa](https://blog.risingstack.com/introduction-to-koa-generators/)