---
layout: post
title: 使用Bower进行前端依赖管理
category: technique
---

Bower是一个用于管理前端依赖的包管理器（Package Manager），该开源项目由Twitter创建。与此相对应的包括，PHP的`Composer`，Node的`NPM`，和Ruby的`RubyGems`。本文通过结合官方文档和一些简单的实例来展示Bower是如何提升开发效率的。
<!--more-->

> 2015/03/08 update

##为什么要用Bower

使用类似于[Bower](http://bower.io/)这样的包管理器主要基于以下几个原因：

- 方便的寻找和下载你需要的依赖库，并将它们整合到项目中，例如jQuery, Angular等。
- 方便的下载指定版本的依赖库（免除去网络上搜索和下载）
- 便于你使用简单的方法获取你想要的依赖库

###安装Bower
Bower依赖于Node.js，Git（资源主要通过git进行下载），因此你需要提前安装好，才能正常安装bower。 Bower可以通过NPM进行安装：

	$ npm install -g bower 	//全局安装bower
	$ bower --version 		//检查版本确认是否安装好
	1.3.12  				//本文使用的bower版本

###基础使用

Bower的基础使用，可以参考[这篇文章](http://segmentfault.com/a/1190000000349555)。本文依然会介绍Bower的常用使用细节，但综合了多篇文章和Bower的官方文档。下面我们通过一个示例项目来使用Bower,首先创建项目目录

	$ bower help			//帮助命令
	$ mkdir bower-in-action
	$ cd bower-in-action
	$ mkdir jquery-in-action
	$ cd jquery-in-action
	
安装jQuery和Bootstrap依赖

	$ bower install jquery
	$ bower install bootstrap

项目会自动生成`bower_components`目录，jquery和bootstrap的相关文件都会被下载到该文件夹内。

安装依赖可以有很多种方式，主要包括以下4种方式：

	# registered package
	$ bower install jquery
	# GitHub shorthand
	$ bower install desandro/masonry
	# Git endpoint
	$ bower install git://github.com/user/package.git
	# URL
	$ bower install http://example.com/script.js
	
卸载包

	$ bower uninstall jquery

搜索相关的依赖，你可以使用如下工具

	http://bower.io/search/

当然你也可以使用一个bower指令来搜索，但不如web页面来的方便直观

	$ bower search bootstrap

##在项目中设置Bower

为了在项目中使用`Bower`，你需要下面两个文件

- `.bowerrc` 用于告诉Bower需要将依赖安装在什么地方
- `bower.json` 用于告诉Bower需要安装那些依赖

###定义Bower目录

Bower的默认目录为项目根目录下的`bower_components`，通常我们不想使用这个文件夹。我们可以创建`.bowerrc`文件，并在其中使用JSON语法配置目录信息：

	// .bowerrc
	{
	    "directory": "libs"
	}

接来下，我们安装的依赖包都会下载到这个目录中。

###安装多个依赖包

为我们通常通过`bower.json`文件来管理依赖包。可以通过下面的的命令生成`bower.json`文件：

	bower init

它会自动提示你输入一系列的内容，以生成最终的文件，包括项目名称、版本号、作者信息、项目描述信息、关键词、开源证书等等。关于bower.josn文件的详细解释可以参考[链接页面](http://bower.io/docs/creating-packages/#bowerjson)，这里示例文件如下：
	
	{
	  "name": "jquery-in-action",
	  "version": "0.0.0",
	  "authors": [
	    "Weiwei <ww.sun@outlook.com>"
	  ],
	  "description": "test bower using jquery & bootstrap",
	  "keywords": [
	    "jquery",
	    "bootstrap"
	  ],
	  "license": "MIT",
	  "dependencies": {
        "bootstrap": "latest",
        "font-awesome": "latest",
        "animate.css": "latest",
        "angular": "latest"    
      },
	  "devDependencies": {
	    "angular": "~1.3.8"
	  }
	}

需要注意的是，这里有两个版本的依赖，一个是`dependencies`，另一个是`devDependencies`，分别代表生产环境和开发环境中的依赖包，两种环境在很多情况下有区别，比如在开发环境中我们通常使用jquery.js、开启详细的日志；在生产环境中通常使用jquery.min.js、向用户暴露简单的错误信息。它们可以分别通过下面两个指令自动添加：

	bower install jquery --save			//添加到dependencies
	bower install angular --save-dev		//添加到devDependencies

##使用Bower包

下面我们来编写一个示例页面来引入我们需要的包：
	
	<!-- index.html -->
	<!doctype>
	<head>
	    <link rel="stylesheet" href="libs/bootstrap/dist/css/bootstrap.min.css">
	    <link rel="stylesheet" href="libs/font-awesome/css/font-awesome.min.css">
	    <link rel="stylesheet" href="libs/animate.css/animate.min.css">
	
	    <script src="libs/jquery/jquery.min.js"></script>
	    <script src="libs/bootstrap/dist/js/bootstrap.min.js"></script>
	    <script src="libs/angular/angular.min.js"></script>
	</head>
	
	...



###其他配置信息

Bower可以通过`.bowerrc`文件进行配置，它是一个JSON文件，你可以直接在项目的根目录创建该文件，通过该文件我们可以指定bower的依赖安装目录，网关服务器，超时连接等配置信息，该文件的详细配置参数的说明见[链接页面](http://bower.io/docs/config/)。内容如下：

	{
	  "directory": "bower_components",
	  "analytics": false,
	  "timeout": 120000,
	  "registry": {
	    "search": [
	      "http://localhost:8000",
	      "https://bower.herokuapp.com"
	    ]
	  }
	}

## 使用Bower只下载你需要的文件

这里请参考[链接](https://scotch.io/tutorials/only-grab-the-files-you-need-while-using-bower)。

##References

1. http://bower.io/
2. http://bower.io/docs/creating-packages/#bowerjson
2. http://bower.io/docs/tools/
3. http://segmentfault.com/a/1190000000349555
4. http://bower.io/docs/config/
5. https://scotch.io/tutorials/manage-front-end-resources-with-bower
6. https://scotch.io/tutorials/only-grab-the-files-you-need-while-using-bower