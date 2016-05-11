---
layout: post
title: Learning Stream in Node.js
category: technique
---

流是Node.js中一个非常重要的概念，也是Node.js之所以适用于数据密集型场景的重要原因之一。
本文将用尽可能简单的方式为你介绍Node中流的概念。

<!--more-->

## 流 Stream

> 事实上，流通常用于将程序连接在一起。流可以被读和写。被流连接在一起的程序通常很小，并且只专注于做一件事。

你可能经常在项目中使用Gulp来做项目的代码构建，那么在使用过程中，你很可能碰到过类似下面的错误。
错误大概是这样个的：

	stream.js:94
		throw er; // Unhandled stream error in pipe.
		
不得不承认，当我第一次碰到这个错误的时候。我对流的概念毫无头绪。我像很多程序员一样，
首先借助Google去了解这个概念。例如你可以在谷歌搜索`node stream`这样的关键词。

第一个结果是来自Reddit的，它建议我去安装Nodeschool程序，然后完成`stream-adventure`系列的练习。

在安装Stream Adventure之前，我首先阅读了Node.js的官方文档，它是这么写的：

> 流是一个抽象接口，在Node.js中它借助于多种对象实现。例如，一个对HTTP服务器的请求是一个流，
可以是stdout。流是可读的，可写的，或两者兼备。所有的流都是`EventEmitter`的实例。

本质上，流允许你讲其他对象或程序连接在一起。你将某些输入，然后让它经过流，
将它传递到另一个程序中。我比较喜欢拿水管来做类比。将一组小型的管道（程序）连接在一起，
用于完成一些特定的任务。

管道（pipe）的概念很早就存在于Unix系统中，你可以通过这篇文章了解更多：[Unix Pipelines](https://en.wikipedia.org/wiki/Pipeline_(Unix))

## 流的特点

流可以是：可读的、可写的，或者两者兼备

- 可读的：读一个文件（输入）
- 可写的：写一个文件（输出）
- 可读可写：读和写一个文件（输入/输出）

现在，我们来写个程序用来读取输入，然后将结果打印在控制台上。

	process.stdin.pipe(process.stdout);
	
`process`对象会获取输入，然后将其作为输出结果打印出来。上面的代码来自于Hack Reactor的视频。
如果运行和这个文件，运行结果如下：

	$ node output.js
	test
	test
	echo
	echo
	me
	me
	hello world
	hello world
	
## 实践

让我们来看一些更高级的内容，谈谈`fs`文件系统模块。`fs`模块允许你读、写、甚至是改变闻俊或目录的权限等级。

	fs.createReadStream(path[, options])
	
我们现在准备些一个程序用于读取`hello.txt`中的内容，其中包括的内容如下：

	hello world
	
示例程序如下：用来读取文件，执行的时候将其吐到控制台上

	// 获取Node的文件系统模块
	var fs = require('fs');
	
	// 指定读取流，指向目标文件，编码格式为utf-8
	var file = fs.createReadStream('hello.txt', {encoding: 'utf-8'});
	
	// 流是EventEmitter的实例，我们可以为其添加事件
	// 当打开文件时触发open事件
	file.on('open', function () {
		
		// 使用管道，将文件内容输出到屏幕上
		// process对象也是一个EventEmitter实例
		this.pipe(process.stdout);
	});
	
程序非常的简单直观。正如上面的代码所示，我们使用`pipe()`方法将文件系统中的内容传递进了`process`对象。
然后`process`对象将它打印到屏幕上。

为了能够进一步的了解Node流的概念，我推荐你也去完成Nodeschool的Stream。

## References

1. [Introduction to streams](http://www.sitepoint.com/introduction-to-streams/)
1. [Hack Reactor's Video About Node Streams](https://www.youtube.com/watch?v=OeqnIuTMod4)
2. [Stream (Node.js)](https://nodejs.org/api/stream.html)
3. [File System (Node.js)](https://nodejs.org/api/fs.html)
4. [Node Streams Article by Max Ogden](http://maxogden.com/node-streams.html)