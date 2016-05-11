---
layout: post
title: Node.js编程建议（2）
category: technique
---

在[前一篇文章](http://wwsun.me/posts/node-best-practices.html)中，我们已经探讨过关于Node.js的编程建议，
本文将继续探讨这一话题。希望能够与大家分享更多关于Node.js开发的经验。

<!--more-->
## Statement

> 原文地址：https://blog.risingstack.com/node-js-best-practices-part-2/

## 一致的风格

当你在一个较大的团队内开发JavaScript应用时，创建一个人人都遵守的
[开发规范](https://github.com/RisingStack/node-style-guide)就显得非常的重要。如果你手头没有这样的
一份开发规范，那么我建议你使用RisisngStack在使用的[Node.js风格指南](https://github.com/RisingStack/node-style-guide)。
中文版风格指南点击[该链接](https://github.com/wwsun/node-style-guide)。


但这仅仅是第一步，当你建立了一个标准后，团队中的每个成员就应该遵守这样的规范。这也是为什么
[JSCS](https://github.com/jscs-dev/node-jscs)这样的工具会出现的原因，它能够帮助你遵守规范。

JSCS是一个JavaScript代码风格检查工具。在你的项目中使用JSCS非常的简单：

	npm install jscs --save-dev
	
下一步需要在`package.json`配置运行脚本：

	scripts: {
		"jscs": "jscs index.js"
	}
	
当然你也可以添加多个文件或目录用于检测。todo

你可以在`.jscsrc`文件中设置你的验证规则，或者使用jscs预置的规则。查看预置规则可以在访问这个
[链接](https://github.com/jscs-dev/node-jscs/tree/master/presets)，然后通过使用
`--preset=[PRESET_NAME]`来使用它们。

## 实施JSHint/JSCS规则

你的构建管道应该包含JSHint和JSCS，但是如果能够在开发者机器上执行pre-commit验证可能是个不错的主意。

你可以使用NPM中的`pre-commit`包来轻松的完成这个任务。

	npm install --save-dev pre-commit
	
然后在`package.json`中配置它：

	"pre-commit": [
		"jshint",
		"jscs"
	]
	
需要注意，`pre-commit`会在`package.json`中的`script`部分寻找执行脚本。通过使用这个，代码会在
每次提交时执行验证。

## 使用JS来做配置管理

我们会在很多的项目中发现使用JSON文件来做配置管理。也许这是个非常广泛的实践，但我想JS文件会提供更多的
便捷性。基于这一点，我们鼓励你在项目中使用`config.js`文件，例如：

	var url = require('url');
	var config = module.exports = {};
	var redisToGoConfig;
	
	config.server = {
		host: '0.0.0.0',
		port: process.env.PORT || 3000
	};
	
	// look, a comment in the config file! 
	// would be tricky in a JSON ;)
	config.redis = {
		host: 'localhost',
		port: 6379,
		options: {
			
		}
	};
	
	if (process.env.REDISTOGO_URL) {
		redisToGoConfig = url.parse(process.env.REDISTOGO_URL);
		config.redis.port = redisToGoConfig.port;
		config.redis.host = redisToGoConfig.hostname;
		config.redis.options.auth_pass = redisToGoConfig.auth.split(':')[1];
	}
	
## 使用NODE_PATH

你是否曾经遇到过下面这样的代码:

	var myModule = require('../../../../lib/myModule');
	
	myModule.doSomething(function (err) {
	
	});

当你的项目拥有一个非常复杂的结构时，引入模块的时候可能会变得更加混乱。有两种方法能够解决这个问题：

- 将你的模块符号链接到`node_module`文件夹
- 使用`NODE_PATH`

通常我们会使用`NODE_PATH`这个方法，因为符号链接所有的模块到`node_modules`文件夹可能会导致很多麻烦，
并且在不同的操作系统上可能会遇到问题。

### 设置NODE_PATH

假设你有如下的项目结构:

	+ lib
		+ model
			- Car.js
		- index.js
		- package.json
		
我们使用`NODE_PATH`来指向`lib`目录，而不是使用相对路径。在我们的`package.json`文件中设置start脚本，
然后我们可以使用`npm start`来执行这个脚本。示例代码如下:

	// index.js
	var Car = require('model/Car');
	

	// lib/model/Car.js
	console.log('I am a Car!');
	

	// package.json
	{
		"name": "node_path",
		"version": "1.0.0",
		"description": "",
		"main": "index.js",
		"scripts": {
			"start": "NODE_PATH=lib node index.js"
		},
		"author": "",
		"license": "ISC"
	}
	
## 依赖注入

> Dependency injection is a software design pattern in which one or more dependencies 
(or services) are injected, or passed by reference, into a dependent object.

使用依赖注入对于测试而言非常有帮助。因为你可以轻松的使用这种模式模拟模块需要的依赖。

	// index.js
	var db = require('db');
	// do some init here, or connect
	db.init();
	
	var userModel = require('User')({
		db: db
	});
	
	userModel.create(function (err, user) {
		
	});
	
	
	// test.js
	var test = require('tape');
	var userModel = require('User');
	
	test('it creates a user with id', function (t) {
		var user = {
			id: 1
		};
		var fakeDb = {
			query: function (done) {
				done(null, user);
			}
		}
		
		userModel({
			db: fakeDb
		}).create(function (err, user) {
			t.equal(user.id, 1, 'User id should match');
			t.end();
		})
	
	});
	
	// User.js
	function userModel (options) {
		var db;
		
		if(!options.db) {
			throw new Error('Options.db is required!');
		}
		
		db = options.db;
		
		return {
			create: function (done) {
				db.query('INSERT ...', done);
			}
		}
	}
	
	moudule.exports = userModel;
	
在上面的例子中，我们有两个不同的`db`。在`index.js`文件中，我们有真正的`db`模块，但是在`test.js`中
我们创建的是一个假的`db`。通过这种方式，我们能够在测试中轻松的注入假的依赖。