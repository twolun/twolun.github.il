---
layout: post
title: 使用D3进行数据可视化
category: technology
---

> 先给出一个大小合适、筛选得当的概要，然后根据需要展示细节。 —— Ben Shneiderman

###D3基础知识

D3是一个JS库，用于创建数据可视化图形，能够实现交互可视化，而交互可视化能够把那些原本会对相关主题和数据视而不见的人吸引过来。 D3的全程为 Data-Driven Documents（数据驱动的文档）。D3的项目地址为：

	https://github.com/mbostock/d3/

<!--more-->

D3的运行后过程如下：

1. 将数据加载到浏览器的内存空间
2. 把数据绑定到文档中的元素，根据需要创建新元素
3. 解析每个元素的范围资料并为其设置相应的可视化属性，实现元素的变换
4. 响应用户输入实现元素状态的过渡

需要注意的是，D3不隐藏你的原始数据。D3代码在客户端执行（即用户浏览器），因此你想要可视化的数据必须发送到客户端。假如你的数据不能共享，就不要使用D3了。

###生成页面元素

	d3.select("body").append("p").text("New paragraph!");

1. d3 引用D3对象
2. select("body") 取得文档的body元素，类似于Jquery的选择器
3. append("p") 在选择的页面元素中创建一个新的的DOM元素
4. text("content") 在p标签中插入指定的文字
5. ; 表示结束

此外，D3的选择器还支持直接选择指定ID或者class的元素，使用方式分别如下。注意，select方式选择的仅是匹配选项的第一个元素，若想选择所有元素，则需要使用 d3.selectAll()方法

	d3.select(".ClassName")
	d3.select("#wrapper")

###加载和绑定数据

在D3中，为了实现映射规则，需要把数据输入值绑定到DOM中的元素。绑定即把数据“附加”或关联到特定的元素，以便将来引用数据的值和应用映射规则。

D3通过 selection.data() 方法把数据绑定到DOM元素。D3可以直接加载外部数据，如CSV或JSON，这里以JSON为例，加载外部数据的格式如下：

	var dataset;
	d3.json("graph.json", function(json) {
		console.log(json);
	});

###绘制DIV

在D3中，给元素添加类使用 selection.attr() 方法，attr()设定DOM属性的值，使用style()直接给元素添加CSS样式。例如，给元素添加一个 bar 类：

	.attr("class", "bar")

给元素快速添加或删除类，可使用如下规则：

	.classed("bar", true)

若为true, 则给元素添加bar类，若为false，这给元素删除bar类。

###绘制SVG

在D3中，我们通常用如下的方式创建svg元素，并获得一个svg的引用。

	var w = 500;
	var h = 50;
	var svg = d3.select("body").append("svg").attr("width", w).attr("height",h);

利用数据绘制图形

	var circles = svg.selectAll("circle").data(dataset).enter().append("circle");

1. selectAll() 会返回所有圆形的空引用
2. data() 把数据绑定到即将创建的元素
3. enter() 返回对这个新元素的占位引用
4. append() 将圆形添加到DOM

	circles.attr("cx", function(d,i) {
		return (i*50) + 25;
	})

1. cx为圆形的圆心x轴坐标
2. d对应原始数据集中的数据
3. i为当前元素的索引值，从0开始，可以改变其名字

###比例尺

>比例尺是一组把输入域映射为输出范围的函数。——Mike Bostock

要理解D3的比例尺，首先要熟记D3比例尺的一个基本规则“***输入：值域，输出：范围***”。

归一化：归一化就是根据可能的最小值和最大值，将某个数值映射为介于0和1之间的一个新值的过程。对于线性比例尺，D3可以帮助我们处理归一化过程中的数学计算：输入值根据值域先进行归一化，然后再把归一化后的值对应到输出范围。

	varscale = d3.scale.linear()
		.domain([100, 500]) //输入的值域
		.range([10, 350]);  //输出的范围

现在比例尺就准备就绪了：
	
	scale(100); //返回10
	scale(300); //返回180
	scale(500); //返回350

通过 d3.min() 和 d3.max() 可以动态的分析数据集，得到最值。下面的代码，会循环数组中的每个数，得到最大值：

	d3.max(dataset, function(d) {
		return d[0]; //返回嵌套数组中的第一个值
	});

创建一个动态映射x轴的比例尺函数：

	varxScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) { 
			return d[0]; 
		})])
		.range([0, w]);