---
layout: post
title: 从零开始开发MEAN栈单页面应用
category: technique
---

本文主要介绍了基于`MongoDB`, `Express`, `AngularJS`, `Node.js`（也被称为MEAN栈）的单页面应用开发的前期配置工作，通过本文的介绍，我们将会创建一个MEAN应用的起始框架，以此来作为其他项目的基础。这对你构建其他MEAN应用而言，将会是一个非常好的起点。
<!--more-->


你可能已经了解了[mean.io](http://mean.io/#!/)和[meanjs.org](http://meanjs.org/)，它们都是非常不错的融合了很多高级特性的MEAN应用。但是，很多时候，你还是会觉得它们太过复杂了，不太适合被用来构建一些简单的应用。因此，下面我们将重头开始来构建MEAN应用的基础框架。

本文以[2]为基础，你可以直接阅读该文章，但更换了Angular的路由模块为`angular-ui-router`，以及使用了`ControllerAs`语法，你可以直接查看源代码[1]。

## 应用基本需求

- 单页面应用SAP
- Node.js作为后端，包括Express和MongoDB
- AngularJS作为前端
- 模块化Angular组件，包括controllers, services
- 易于扩展的项目组织结构

本项目的完整[源代码](https://github.com/wwsun/starter-node-angular)：

	git clone https://github.com/wwsun/starter-node-angular


## 项目目录结构

    - app
        ----- models/
        ---------- nerd.js <!-- the nerd model to handle CRUD -->
    ----- routes.js
    - config
        ----- db.js 
    - node_modules <!-- created by npm install -->
    - public <!-- all frontend and angular stuff -->
    ----- css
    ----- js
    ---------- controllers <!-- angular controllers -->
    ---------- services <!-- angular services -->
    ---------- app.js <!-- angular application -->
    ---------- appRoutes.js <!-- angular routes -->
    ----- img
    ----- libs <!-- created by bower install -->
    ----- views 
    ---------- home.html
    ---------- nerd.html
    ---------- geek.html
    ----- index.html
    - .bowerrc <!-- tells bower where to put files (public/libs) -->
    - bower.json <!-- tells bower which files we need -->
    - package.json <!-- tells npm which packages we need -->
    - server.js <!-- set up our node application -->

所有的后端工作都会在`server.js`，`app`和`config`中完成，所有的前端工作会在`public`中完成。

## Node应用
所有的Node应用都会以`package.json`为起点，该文件如下

    {
      "name": "starter-node-angular",
      "main": "server.js",
      "dependencies": {
        "express" : "~4.5.1",
        "mongoose" : "~3.8.0",
        "body-parser" : "~1.4.2",
        "method-override" : "~2.0.2"        
      }
    }

现在，应用将会知道项目会使用Express和Mongoose。

`server.js`文件用来启动应用。`config,js`用于配置数据库信息。`models`下存放了一个简单的文档模型，你可以根据你的需求增加更为复杂的。

## 前端
所有的后端工作完成后，我们可以专注于前端工作。所有访问该应用的用户，Node后端都会将`index.html`返回给前端，因为我们在后端路由中定义了`app.get('*')`。

前端开发需要以下内容：

- 使用Bower做依赖管理
- Angular应用结构（Controllers, services）
- 我们将创建三个不同的页面（Home, Nerds, Geeks）
- 使用`angular-ui-router`处理路由
- 使用Bootstrap

### 使用Bower进行前端依赖管理

`.bowerrc`文件会告诉Bower将文件下载安放到的具体位置：

	{
	    "directory": "public/libs"
	}

`bower.json`和`package.json`类似，会告诉Bower我们需要哪些前端依赖：

	{
		"name": "angular",
		"version": "1.0.0",
		"dependencies": {
			"bootstrap": "latest",
			"angular": "latest",
			"angular-ui-router": "latest"
		}
	}

在控制台中运行`bower install`，bower将会下载需要的依赖库并放到`public/libs`文件夹中。


### Angular-ui router

我们使用`angular-ui-router`进行路由管理，在`appRoutes.js`文件中定义路由信息，如下：

	angular.module('appRoutes', []).config(function($stateProvider, $urlRouterProvider) {
	
	    $urlRouterProvider.otherwise('/');
	
	    $stateProvider
	        .state('home', {
	            url: '/',
	            templateUrl: 'views/home.html',
	            controller: 'MainController as mainCtrl'
	        })
	
	        .state('nerds', {
	            url: '/nerds',
	            templateUrl: 'views/nerd.html',
	            controller: 'NerdController as nerdCtrl'
	        })
	
	        .state('geeks', {
	            url: '/geeks',
	            templateUrl: 'views/geek.html',
	            controller: 'GeekController as geekCtrl'
	        })
	});

每个页面的控制器我们都使用了ControllerAs语法，这样可以避免`$scope`变量注入的各种问题。在`index.html`中我们可以使用`<div ui-view></div>`语句将内容动态注入到模版中。

###视图内容
`index.html`页面内容如下：

	<!doctype html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<base href="/">
	
		<title>Flapper News</title>
	
		<!-- CSS -->
		<link rel="stylesheet" href="libs/bootstrap/dist/css/bootstrap.min.css">
		<link rel="stylesheet" href="css/style.css"> <!-- custom styles -->
	
		<!-- JS -->
		<script src="libs/angular/angular.min.js"></script>
		<script src="libs/angular-ui-router/release/angular-ui-router.min.js"></script>
	
		<!-- ANGULAR CUSTOM -->
		<script src="js/controllers/MainCtrl.js"></script>
		<script src="js/controllers/NerdCtrl.js"></script>
		<script src="js/services/NerdService.js"></script>
		<script src="js/controllers/GeekCtrl.js"></script>
		<script src="js/services/GeekService.js"></script>
		<script src="js/appRoutes.js"></script>
		<script src="js/app.js"></script>
	</head>
	<body ng-app="sampleApp">
	<div class="container">
		
		<!-- HEADER -->
		<nav class="navbar navbar-inverse">
			<div class="navbar-header">
				<a class="navbar-brand" href="/">Flapper News</a>
			</div>
			<ul class="nav navbar-nav">
	            <li><a ui-sref="home">Home</a></li>
				<li><a ui-sref="nerds">Nerds</a></li>
				<li><a ui-sref="geeks">Geeks</a></li>
			</ul>
		</nav>
	
		<!-- ANGULAR DYNAMIC CONTENT -->
		<div ui-view></div>
	
	</div>
	</body>
	</html>

### 子页面

以`views/home.html`为例，视图内容如下：

	<div class="jumbotron text-center">
		<h1>Home Page 4 Life</h1>
	
		<p>{{ mainCtrl.tagline }}</p>
	</div>

其他子页面都是类似的，你可以查看本项目的源代码，这里不再重复。

### 组合
注意，要想让路由生效，你还需要在模块中注入`ui.router`。在`app.js`需要进行如下定义：

	angular.module('sampleApp', ['ui.router', 'appRoutes', 'MainCtrl', 'NerdCtrl', 'NerdService', 'GeekCtrl', 'GeekService']);

## 总结

通过本文，我们将能够搭建一个MEAN项目的基础框架，以Node为后端，Angular为前端，以此为基础，你可添加更多的高级功能，如认证、REST API等等。

- 项目的完整源代码：https://github.com/wwsun/starter-node-angular
- 使用Jade模版引擎的版本：https://github.com/Zemke/starter-node-angular
- 原文： https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application

## References

1. https://github.com/wwsun/starter-node-angular
2. https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application
3. https://scotch.io/bar-talk/expressjs-4-0-new-features-and-upgrading-from-3-0
4. https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular