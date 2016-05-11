---
layout: post
title: 基于Worklight开发混合移动应用
category: technique
---

混合移动应用一般指的是基于HTML5而开发的移动应用，它的特点通过一些编译环境可以快速的生成多个平台的应用，做到“一次编写，多处运行”的特点。本文将简要概述混合移动应用开发的相关经验，并分享一些相关的资源。

<!--more-->

###IBM Worklight
Worklight原本是以色列的一家公司，[后被IBM收购](http://www.36kr.com/p/79555.html)。Worklight使用的是HTML5技术开发混合、本地的移动应用。其安全性、整合数据的管理和分析能力都有很大的优势。通过为跨平台设备提供更好的客户使用体验，WorkLight 可以有效的减少企业应用的市场推广时间、成本和复杂性。

Wokrlight的基础知识可以参考[这篇文章](http://www.ibm.com/developerworks/cn/mobile/mo-aim1206-working-with-worklight-1/)，这篇文章详细介绍了如何配置Worklight的开发环境，及相关的基础知识。IBM为Worklight提供了非常详细的开发文档，可以帮助开发者快速的上手Wokrlight的开发，参考[这个页面](http://www.ibm.com/developerworks/cn/mobile/worklight/getting-started.html)。

###Worklight Tutorial
我整理了Worklight开发的一些常用的资源，这涉及到客户端、服务器端、通用控件、集成新浪微博API，集成百度地图API，以及如何在Wokrlight中使用MongoDB等相关开发内容。有兴趣的读者可以使用下面的命令获取资源，或直接访问我的[Github项目页面](https://github.com/wwsun/worklight-tutorial)。

	git clone https://github.com/wwsun/worklight-tutorial.git

我的测试环境如下：

- OS：Windows 8.1 pro en-us x64
- JDK: 1.7
- Eclipse EE Luna x64
- MongoDB 2.6 x64

在上面的Worklight Tutorial，我详细编写了每一部分的使用文档，你可以阅读相关的Markdown文件以获得详细的开发信息。但是，我还是希望你能够阅读官方的文档获取最详细的开发说明。

###基础知识

Worklight开发的混合移动应用，主要使用到了两大技术用于实现跨平台应用的开发：Apache Cordova和PhoneGap。其中Apache Cordova使得应用能够通过JavaScript技术直接调用设备的本地功能，例如相机、传感器等，这很好的隔离了混合移动应用与原生应用之间开发的复杂度。

PhoneGap是一个开源的HTML5平台，允许你使用我们之前讨论的混合型方法为多个移动操作系统创建原生应用。你可以使用HTML5技术编写应用，PhoneGap通过一个一致的、跨平台的JS API在你的代码和原生代码之间搭建桥梁。

这两个项目都是开源的，你可以访问它们的官方网站获取更详细的信息


###移动web应用框架
Web应用框架是一组打包的交互式元素和代码工具，可以为我们助一臂之力。

1. 框架可以帮我们让网站或应用看上去是移动友好的。
2. 框架可以帮助我们让网站或应用感觉是面向移动的。
3. 框架可以帮助我们管理跨平台不一致性。

本文不会介绍具体的框架使用方法，如果你感兴趣，可以访问它们的官方网站寻找相关的学习资源。
通常你可以有如下的几种选择：

1. jQuery Mobile
2. Dojo
3. Sencha Touch
4. ...

