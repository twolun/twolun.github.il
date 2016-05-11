---
layout: post
title: Node.js编程建议（1）
category: knowledge
---

本文总结一下我们在工作中的Node.js的最佳实践，包括Node.js的代码风格以及开发者工作流。本文是本系列的第一篇。

<!--more-->

## 代码风格

### 回调约定

模块应该暴露错误优先的回调接口。

	module.exports = function (dragonName, callback) {  
	  // do some stuff here
	  var dragon = createDragon(dragonName);
	
	  // note, that the first parameter is the error
	  // which is null here
	  // but if an error occurs, then a new Error
	  // should be passed here
	  return callback(null, dragon);
	}

**总是在回调中检查错误**： 为了理解这一点，我们从一个违反该规则的例子看起

	// this example is **BROKEN**, we will fix it soon :)
	var fs = require('fs');
	
	function readJSON(filePath, callback) {  
	  fs.readFile(filePath, function(err, data) {  
	    callback(JSON.parse(data));
	  });
	}
	
	readJSON('./package.json', function (err, pkg) { ... }

`readJSON`函数的最主要的问题是，如果在执行过程中发生`Error`，它并不会检查这个错误。

改进版本如下：

	// this example is **STILL BROKEN**, we are fixing it!
	function readJSON(filePath, callback) {  
	  fs.readFile(filePath, function(err, data) {
	    // here we check, if an error happened
	    if (err) {
	      // yep, pass the error to the callback
	      // remember: error-first callbacks
	      callback(err);
	    }
	
	    // no error, pass a null and the JSON
	    callback(null, JSON.parse(data));
	  });
	}
**在回调中返回！**

上面代码仍然存在的问题是，当`Error`发生的时候，程序的执行并不会在`if`语句中停止，而是会继续。这回导致很多意料之外的问题。正如上面加粗部分提到的，总是在回调中返回！

	// this example is **STILL BROKEN**, we are fixing it!
	function readJSON(filePath, callback) {  
	  fs.readFile(filePath, function(err, data) {
	    if (err) {
	      return callback(err);
	    }
	
	    return callback(null, JSON.parse(data));
	  });
	}
**只在同步代码中使用try-catch**

有一点需要注意的是，`JSON.parse`在无法将指定的字符串格式化为JSON格式的时候会抛出一个异常。

因为`JSON.parse`是一个同步函数，因此我们可以将其包围在`try-catch`语句块中。**一定要注意的是，只有同步代码块才能使用try-catch，你不能用在回调中！**

	// this example **WORKS**! :)
	function readJSON(filePath, callback) {  
	  fs.readFile(filePath, function(err, data) {
	    var parsedJson;
	
	    // Handle error
	    if (err) {
	       return callback(err);
	    }
	
	    // Parse JSON
	    try {
	      parsedJson = JSON.parse(data);
	    } catch (exception) {
	      return callback(exception);
	    }
	
	    // Everything is ok
	    return callback(null, parsedJson);
	  });
	}

**避免`this`和`new`**

在Node中与指定的上下文绑定并不是总是个好事，因为在Node程序中经常涉及到传递回调函数，并且会经常使用高层函数管理工作流。函数风格的编程方式会帮你避免很多麻烦。

### 创建小模块

使用Unix的方式：

> Developers should build a program out of simple parts connected by well defined interfaces, so problems are local, and parts of the program can be replaced in future versions to support new features.

保持模块足够小（内聚），模块应该只做一件事！

### 使用好的同步模式

使用[async](https://github.com/caolan/async)

### 错误处理

错误主要分为两种：操作错误（operational errors）和程序员错误。

**Operational errors**

例如：

1. 请求超时
2. 系统内存不足
3. 连接远程服务失败

### 处理Operational errors

Log everything! 启用日志服务！

### 程序员错误

程序员错误即是程序的bug。这是你可以尽量避免的，比如：

1. 调用异步方法时没有使用回调
2. 无法读取`undefined`的属性

## 工作流建议

### 使用`npm init`启动一个新项目

`init`命令帮你创建一个应用的`package.json`文件，并且会设置一些初始值，便于你后期进行修改。试着用这个命令启动一个新项目吧：

	mkdir my-awesome-new-project  
	cd my-awesome-new-project  
	npm init

### 指定一个start和test脚本

在`package.json`中你可以使用`script`属性设置脚本。默认情况下，`npm init`会生成两个，`start`和`test`。你可以使用`npm start`和`npm test`执行他们。

当然你也可以定义自己的脚本，使用如下命令执行`npm run-script <SCRIPT_NAME>`。

注意，NPM会设置`$PATH`来查找`node_modules/.bin`中的可执行文件。这可以避免安装全局的NPM模块。也就是说，例如`grunt`这样的工具，你可以只安装在项目中，而不是全局安装这个NPM模块。

### 环境变量

在生产和开发环境可能需要设置不同的环境变量，最通常的方法是通过`NODE_ENV`来分别设置`production`或`staging`。

基于不同的环境变量，你可以载入不同的配置信息，例如可以借助[nconf模块](https://github.com/indexzero/nconf)。

当然你也可以利用`process.env`在你的Node.js应用程序中使用其他的环境变量，也就是你可以在一个对象中包含用户环境。

可以参考Node的[对应文档](https://nodejs.org/api/process.html#process_process_env)。

### 不要重复发明轮子

首先寻找已有的解决方案。NPM中包括非常丰富的包，所以请最大化的利用这些资源。

### 使用风格指南

可以参考RisingStack的[Node.js风格指南](https://github.com/RisingStack/node-style-guide)。

## More

Node.js编程建议（2）已发布，点击[链接](http://wwsun.me/posts/node-best-practices-2.html)查看。

## Statement

> 原文地址：https://blog.risingstack.com/node-js-best-practices/