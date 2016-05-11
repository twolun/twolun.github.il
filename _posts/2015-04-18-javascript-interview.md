---
layout: post
title: 5个经典的JavaScript面试题
category: knowledge
---

JavaScript是一门有意思的语言，入门很快，但是想要深入的理解却并不简单，比如JavaScript中的原型、面向对象。对当前的Web世界而言，JavaScript是一门你必须精通的语言，因此本文借用一些面试题来回顾一下JavaScript中的典型知识点。

<!--more-->


## 面试题

### 1. 变量范围

以下代码的输出结果为：

	(function() {
	   var a = b = 5;
	})();
	 
	console.log(b); //5
	console.log(a); //Error, a is not defined

解答：

在这个立即执行函数表达式（IIFE）中包括两个赋值操作，其中`a`使用`var`关键字进行声明，因此其属于函数内部的局部变量（仅存在于函数中），相反，`b`被分配到全局命名空间。

另一个需要注意的是，这里没有在函数内部使用[严格模式](http://cjihrig.com/blog/javascripts-strict-mode-and-why-you-should-use-it/)(`use strict`;)。如果启用了严格模式，代码会在输出b时报错`Uncaught ReferenceError: b is not defined`,需要记住的是，严格模式要求你显式的引用全局作用域。因此，你需要写成：

	(function() {
	   'use strict';
	   var a = window.b = 5;
	})();
	 
	console.log(b);


### 2. 创建“native”方法

在`String`对象上定义一个`repeatify`方法。该方法接收一个整数作为参数用于指定字符串的重复次数。例如：

	console.log('hello'.repeatify(3)); // hellohellohello

解答：

	String.prototype.repeatify = String.prototype.repeatify || function(times) {
	   var str = '';
	 
	   for (var i = 0; i < times; i++) {
	      str += this;
	   }
	 
	   return str;
	};

这个题目主要测试你对JavaScript中的继承和`prototype`属性的理解。另一个值得关注的点是，在定义该方法前你需要确定该对象中是否已存在你要定义的同名方法。通常，我们使用如下的方式：

	String.prototype.repeatify = String.prototype.repeatify || function(times) {/* code here */};

### 3. 提升 Hoisting

以下代码的执行结果为：

	function test() {
	   console.log(a);     // undefined
	   console.log(foo()); // 2
	    
	   var a = 1;
	   function foo() {
	      return 2;
	   }
	}
	 
	test();

回答：

执行结果分别为`undefined`和`2`。

在JavaScript中，变量和命名函数都会被提升到函数的顶端，但是对变量而言其初始化操作不会被提升。因此，当打印`a`的值时，它虽然存在于函数`test()`中，但其值此刻为`undefined`，即未被初始化。也就是说，上面的代码会被转换成：

	function test() {
	   var a;
	   function foo() {
	      return 2;
	   }
	 
	   console.log(a);
	   console.log(foo());
	    
	   a = 1;
	}
	 
	test();

### 4. `this`在JavaScript中是如何工作的

下面代码的执行结果为：

	var fullname = 'John Doe';
	var obj = {
	   fullname: 'Colin Ihrig',
	   prop: {
	      fullname: 'Aurelio De Rosa',
	      getFullname: function() {
	         return this.fullname;
	      }
	   }
	};
	 
	console.log(obj.prop.getFullname()); // Aurelio De Rosa
	 
	var test = obj.prop.getFullname;
	 
	console.log(test());  // John Doe

解答：

上面的代码打印结果依次为`Aurelio De Rosa`和`John Doe`。 原因在于`this`指向的是函数的执行环境，`this`取决于其被谁调用了，而不是被谁定义了。

对第一个`console.log()`语句而言，`getFullName()`是作为`obj.prop`对象的一个方法被调用的，因此此时的执行环境应该是这个对象。另一方面，但`getFullName()`被分配给`test`变量时，此时的执行环境变成全局对象（`window`），原因是`test`是在全局作用域中定义的。因此，此时的`this`指向的是全局作用域的`fullname`变量，即`John Doe`。

### 5. `call()`和`apply()`

修正题目4中存在的问题，使得最后一个`console.log()`打印出`Aurelio De Rosa`。

解答：

可以使用`call()`或者`apply()`强制切换执行环境，如果你不知道这两者的区别，可以参考[这篇文章](http://www.sitepoint.com/whats-the-difference-between-function-call-and-function-apply/)。如下：

	console.log(test.call(obj.prop)); // 这里使用apply()也是一样的


## JavaScript学习建议

### 阅读列表

无论是jQuery，还是当前热门的AngularJS和ReactJS，都离不开扎实的JavaScript的基础。2015年有很多值得你学习的JavaScript知识，如ECMAScript6, TypeScript等等，但这一切之前，你一定要看的书肯定应该包括下面几本：

1. JavaScript高级程序设计，第三版，Nicholas.C.Zakas
2. JavaScript权威指南，第五版，犀牛书
3. JavaScript语言精粹，修订版，蝴蝶书

### 声明

面试题来源于：http://www.sitepoint.com/5-typical-javascript-interview-exercises/