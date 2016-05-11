---
layout: post
title: DOM事件的实时异步传输方法
category: technique
---

本文是是基于这样的一个需求，收集用户在页面上的鼠标移动轨迹（或点击事件等信息），将数据实时上传到服务器端。为了完成这样的一个应用，我们使用一个全JavaScript的开发方案。客户端使用jQuery通过Ajax的方式上传获取到的鼠标移动轨迹，通过POST请求发送到服务器端。服务器端基于Node+Express方案，解析POST请求并将数据进行存储。

<!--more-->

###准备工作

1. 本项目使用到`Node`, `Bower`, `Express`, `jQuery` 
2. 使用Express生成项目 `exprss -e demo`

###使用jQuery + Ajax进行页面数据采集

在客户端，当用户鼠标在页面上移动时，我们通过其鼠标移动事件`onmousemove`捕获其移动的轨迹数据，并将坐标列表通过POST方式上传到服务器端，交由`/upload`来处理，`/upload`是在服务器端定义的一个路由，该路由中我们将会定义具体的POST处理方式。

    var container = document.getElementById('heatmapContainerWrapper');
    container.onmousemove = function (e) {
        e.preventDefault();
        $.post('/upload', {
            x: e.layerX,
            y: e.layerY,
            l: document.location.pathname,
            v: 1
        });
    };

这里我们上传的信息包括鼠标位置的坐标轴X,Y，当前所在的路径（路由），权重（统一设为1）。

###使用Express + Node处理路由请求


在Node的服务器端，在`app.js`中配置需要处理的路由。为了简化起见，我们只将得到的信息打印到服务器端的终端窗口中。合理通过`bodyParser`中间件对请求信息进行解析。

	app.post('/upload', function(req, res){
	    console.log(JSON.stringify(req.body));
	    res.send(req.body);
	});

通过这样的一个应用，我们可以在开发中完全避免使用其他动态语言编程技术，例如`PHP`,`JSP`等，就能开发简单的RESTful应用，本文只是整个Heatmap项目的一个组件的开发技巧。

###References

1. http://css-tricks.com/tracking-clicks-building-a-clickmap-with-php-and-jquery/