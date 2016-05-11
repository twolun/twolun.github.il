---
layout: post
title: 如何用JavaScript编写Fluent API
category: technique
---

当我们说API是流畅的时候（Fluent API），我们期望别人能够轻松的读懂我们的代码，并且能够很快的在文档的帮助下基于我们的代码进行应用构建。本文将讨论Fluent API，如何考虑，如何设计，以及跨浏览器等。

<!--more-->

## 什么是Fluent API

什么是Fluent API，你可以参考这篇[维基百科文章](http://www.sitepoint.com/javascript-like-boss-understanding-fluent-apis/)，它是面向对象API的一种实现，目的是提供更加可读的代码。jQuery是这类API的一个典范代表：

	$('<div></div>')
     .html("Fluent API are cool!")
     .addClass("header")
     .appendTo("body");

Fluent API允许你通过返回`this`对象的方式将函数链接（Chain）起来。如果你对`this`关键字不是很了解，你可以参考[这篇文章](http://www.sitepoint.com/inner-workings-javascripts-this-keyword/)。

## 创建一个简单的Fluent API

我们可以用下面的方式创建一个简单Fluent API：

	var MyClass = function(a) {
    	this.a = a;
	}
	 
	MyClass.prototype.foo = function(b) {
	    // Do some complex work   
	    this.a += Math.cos(b);
	    return this;
	}

正如你所看到的，技巧是返回`this`对象（其指向当前的实例对象），然后你可以像下面这样使用函数链：

	var obj = new MyClass(5);
	obj.foo(1).foo(2).foo(3);

## 基准测试

在进一步讨论之前，我们需要考虑这种API设计是否会导致性能问题。因此，我们可以执行以下的benchmark:

	// noprotect
	var count = 10000000;
	 
	var MyClass = function(a) {
	    this.a = a;
	}
	 
	MyClass.prototype.foo = function(b) {
	    // Do some complex work   
	    this.a += Math.cos(b);
	    return this;
	}
	 
	MyClass.prototype.foo2 = function (b) {
	    // Do some complex work   
	    this.a += Math.cos(b);
	}
	 
	var start = new Date().getTime();
	var obj = new MyClass(5);
	obj.foo(1).foo(2).foo(3);
	for (var index = 0; index < count; index++) {
	    obj.foo(1).foo(2).foo(3);
	}
	var end = new Date().getTime();
	 
	var start2 = new Date().getTime();
	var obj2 = new MyClass(5);
	for (var index = 0; index < count; index++) {
	    obj2.foo2(1);
	    obj2.foo2(2);
	    obj2.foo2(3);
	}
	var end2 = new Date().getTime();
	 
	var div = document.getElementById("results");
	 
	div.innerHTML += obj.a + ": With return this: " + (end - start) + "ms<BR>";
	div.innerHTML += obj2.a + ": Without return this: " + (end2 - start2) + "ms";

正如你所看到的，`foo`和`foo2`做了完全相同的事。唯一的区别是，`foo`使用了函数链，而`foo2`没有使用。在Chrome 42中的运行结果如下：

	-8658366.13900037: With return this: 1616ms
	-8658365.273163341: Without return this: 1639ms

显然，在Chrome中使用Fruent API会比普通方式运行效率更高些。 
在上面我们使用了两种不同的调用方式：

	obj.foo(1).foo(2).foo(3);

和

	obj2.foo2(1);
	obj2.foo2(2);
	obj2.foo2(3);

在IE和Firefox浏览器中，同样运行上面的代码，我们可以得到如下的结论：

- 在Firefox中，性能不相上下（仅提高了1%）
- 在IE中，Fruent API的性能略低于普通方法（慢了2%左右）

另外，对IE平台不同版本的的测试，你可以借助[modern.IE这个网站](https://www.modern.ie/)。

从上面我们可以得到结论：Fluent API在提高程序可读性的同时，并不会损失性能，而且在Chrome中，对大型应用而言，还能提升性能。因此，我们朝着我们的目标进发吧——编写Fluent API。

## 声明

本文为译文，原文请访问：http://www.sitepoint.com/javascript-like-boss-understanding-fluent-apis/

## References

1. 跨浏览器测试工具 https://www.modern.ie/zh-cn
2. 免费的开发工具 https://www.visualstudio.com/en-us/products/visual-studio-community-vs
3. this关键字解析 http://www.sitepoint.com/inner-workings-javascripts-this-keyword/
4. 编写更快的JavaScript http://channel9.msdn.com/Series/Practical-Performance-Tips-to-Make-Your-HTMLJavaScript-Faster/06