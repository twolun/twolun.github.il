---
layout: post
title: Deployd，快速提供REST服务
category: knowledge
---

Deployd是一款出色的可跨平台的Web API引擎。它建立在Node.js和MongoDB的基础上，以JSON形式（类JSON）存储数据，并且支持使用JavaScript书写服务器端脚本。对于一些测试用的Web应用而言，Deployd可以非常快速的构建服务器端的REST API。

<!--more-->


## 开发准备

1. 注意，安装前需要确保你的机器上安装了`mongod 2.0.x`和`node 0.8.x`及以上版本，并且在PATH中配置了mongodb和node的环境变量
1. 去[官网](http://deployd.com/)下载对应版本： http://deployd.com/
2. 详情参考[安装文档](http://docs.deployd.com/docs/getting-started/installing-deployd.html)
3. 测试方法：安装后在命令行中输入`dpd -V`，如果出现版本号即安装正确

除此之外，你要也可以将deployd作为一个node模块进行安装，可以使用`npm`直接安装：

	npm isntall -g deployd

## First Dployd API

### 创建工程
现在，你可以用如下命令创建一个新的dpd工程，首先定位到你的项目目录下(你可以在根目录下新建一个`deployd`目录，用来统一放置dpd工程)：

	dpd create sportstore
	cd sportstore
	dpd

默认情况下，dpd会在端口2403启动一个Node应用用于监听请求。你也可以使用`-p`参数手动指定端口号：
	
	dpd -p 5500

启动完成后，管理dpd应用的最直接方式是使用dpd提供的管理面板，浏览器中访问：
	
	http://localhost:5500/dashboard

![deployd](/img/posts/150403-dpd-dashboard.PNG)
	
### 创建数据结构

点击资源面板中的绿色加号按钮，选择`Collection`选项，设置新的集合名为`/products`，这里我们创建的示例的数据结构如下：

	name, string, required
	description, string, required
	category, string, required
	price, number, required

### 添加数据

在定义好对象的数据结构后需要做的就是为该集合添加数据。点击左侧菜单的`Data`链接，录入相应的测试数据即可，例如符合上述结构的一条数据如下：

	Kayak, A bot for one person, Watersports, 275

### 测试数据服务

最简单的方法是直接在浏览器输入`http://localhost:5500/products`来测试获得到的数据。一个更合适的方法是使用[Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)来测试，Postman是一个强大的REST API测试工具，它可以安装为Chrome的一个扩展应用。

测试结果如下图所示：
![postman](/img/posts/150403-dpd-postman.PNG)