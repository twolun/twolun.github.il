---
layout: post
title: Node.js中的依赖注入
category: technique
---

依赖注入是一种软件设计模式，一个或多个依赖项（或服务）通过引用被注入或传递进依赖对象中。
在不久前，我曾总结过[Java中依赖注入以及JSR-330的参考实现Guice](/posts/di-guice-post.html)，
如果你感兴趣可以参考前一篇文章，本文将会讨论如何在Node.js程序中使用依赖注入。

<!--more-->

## 使用依赖注入的原因

### 解耦

通过依赖注入能够使模块间松耦合，并且使得代码库变得更加可维护。

### 更简单的单元测试

在测试时，你可以将依赖项传递进模块，而不是硬编码依赖项。

### 快速开发

使用依赖注入的方式，在定义接口后，你可以轻松的工作，而不会遇到合并冲突。

## 如何在Node.js中使用依赖注入

首先，我们来看看如果没有依赖注入，我们如何来编码我们的应用。然后我们再来改写这些代码。

### 不使用依赖注入

	// team.js
	var User = require('./user');
	
	function getTeam(teamId) {  
		return User.find({teamId: teamId});
	}
	
	module.exports.getTeam = getTeam;  
	
可以编写一个简单的测试如下：

	// team.spec.js
	var Team = require('./team');  
	var User = require('./user');
	
	describe('Team', function() {  
		it('#getTeam', function* () {
			var users = [{id: 1, id: 2}];
		
			this.sandbox.stub(User, 'find', function() {
				return Promise.resolve(users);
			});
		
			var team = yield team.getTeam();
		
			expect(team).to.eql(users);
		});
	});

上面的代码中：我们首先创建了一个叫`team.js`的文件，用于返回某个组中的用户列表。
对此，我们需要引入`User`模型，然后我们可以通过调用它的`find`方法来返回特定的用户列表。

这看起来没问题，是吗？但是，当我们需要进行测试它的时候，
我们就不得不通过[sinon](http://sinonjs.org/)来测试stub。

在测试文件中，我们也要`require`这个`User`模型，然后我们才能stub它的`find`方法。
需要注意的是，我们这里正在使用的是沙盒特性，因此在测试运行后我们无需再手动恢复到原来的函数。

> 注意：但原对象使用`Object.freeze`后，Stub将不能工作。

### 使用依赖注入

	// team.js
	function Team(options) {  
		this.options = options;
	}
	
	Team.prototype.getTeam = function(teamId) {  
		return this.options.User.find({teamId: teamId})
	}
	
	function create(options) {  
		return new Team(options);
	}

你可以使用如下的测试文件：

	// team.spec.js
	var Team = require('./team');
	
	describe('Team', function() {  
		it('#getTeam', function* () {
			var users = [{id: 1, id: 2}];
		
			var fakeUser = {
				find: function() {
					return Promise.resolve(users);
				}
			};
		
			var team = Team.create({
				User: fakeUser
			});
		
			var team = yield team.getTeam();
		
			expect(team).to.eql(users);
		});
	});

对比下和之前的不使用依赖注入那个版本的不同之处：
首先一个是使用了[工厂模式](/posts/node-design-patterns.html)：
我们使用这种方法来注入选项/依赖项，从而创建新的对象——这也就是我们要注入`User`模型的地方。

在测试文件中，我们可以创建虚假的模型对象来表示`User`模型，然后我们可以轻松的将它传递进
`Team`模型的`create`方法中。是的，这很简单。

## 在真实项目中的依赖注入

在很多的开源项目中你都可以发现依赖注入的例子。例如，在你每天的工作中，
大多数你使用的Express/Koa中间件都使用了非常类似的方法。

### Express中间件

	var express = require('express');  
	var app = express();  
	var session = require('express-session');
	
	app.use(session({  
		store: require('connect-session-knex')()
	}));
	
上面的代码片段就是利用了工厂模式来使用依赖注入的：在session中间件中，我们传递了
`connect-session-knex`模块（它需要实现一个接口），然后再session模块中被调用。

在这个例子中，`connect-session-knex`模块需要实现下面几个方法：

- store.destroy(sid, callback);
- store.get(sid, callback);
- store.set(sid, session, callback);

### Hapi插件

你可以在Hapi中发现非常类似的概念——下面的例子中将`handlebars`模块注入进Hapi作为视图引擎。

	server.views({  
		engines: {
			html: require('handlebars')
		},
		relativeTo: __dirname,
		path: 'templates'
	});
	
## 推荐阅读

1. [Node.js常用设计模式](http://wwsun.me/posts/node-design-patterns.html)
2. [Node.js编程建议（1）](http://wwsun.me/posts/node-best-practices.html)
3. [Node.js编程建议（2）](http://wwsun.me/posts/node-best-practices-2.html)