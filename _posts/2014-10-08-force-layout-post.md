---
layout: post
title: Using D3 to implement Force-directed Graph
category: knowledge
---

Force-directed Graph，即力导向图，这种布局模拟了物理学中的力在屏幕上排列元素的机制。力导向图适合用于表现网状数据，也即图数据。图由一组节点(nodes)和连线(edges)构成。节点代表数据集中的实体，连线代表节点之间的关系。这里，我们简单的介绍如何用D3实现这种力导向图。

<!--more-->

从物理角度看， 这种布局表现为粒子之间的互斥作用， 但同时也由弹簧连接。 互斥力会使粒子相互远离， 避免在视觉上重叠， 而弹簧可以防止它们离得太远， 保证我们能在屏幕上看到它们。D3 的力导向布局需要我们分别提供结点和连线， 而且都是对象数组的形式。假设 data.json 文件提供的数据如下：

	{
	    "nodes": [
	        { "name": "Root"},
	        { "name": "Product"},
	        { "name": "Supplier"},
	        { "name": "Outsite"}
	    ],
	    "links": [
	        { "source": 0, "target": 1},
	        { "source": 0, "target": 2},
	        { "source": 3, "target": 0}
	    ]
	}

我们这里的结点（nodes）就是人名， 而连线（edges）则包含两个值：来源（source）ID 和目标（ target）ID。 这些 ID对应着上面的结点， 比如ID为3，表示Outsite。当然，你可以不用索引值，而是直接使用上面的name里的值建立连接关系。

载入数据集可以使用下面的方式。并且，我们将绘制的各个过程也在下面的代码中进行了说明。

	d3.json("data.json", function (dataset) {
		//1.init
		//2.create svg
		//3.create links
		//4.create nodes
		//5.create title
		//6.create listener
		//7.click
	}

####1. 初始化：

	var force = d3.layout.force() //选定force布局
	        .nodes(dataset.nodes) //指定节点
	        .links(dataset.links) //指定连线
	        .size([width,height]) //指定画布大小
	        .linkDistance([100])  //连线距离
	        .charge([-100])		  //排斥力
	        .start();			  //开始

####2. 创建SVG画布

    var svg = d3.select("#svgwrapper")	//选中ID为svgwrapper的div元素
        .append("svg")					//添加svg元素
        .attr("width", width)			//指定svg的宽
        .attr("height", height);		//指定svg的高

####3. 绘制连线

    var edges = svg.selectAll("line")
        .data(dataset.links)
        .enter()
        .append("line")
        .style("stroke", "#ccc")		//指定连线的颜色
        .style("stroke-width", 1);		//指定连线的粗细

####4. 绘制节点
	
    var nodes = svg.selectAll("circle")
        .data(dataset.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)					//指定节点的半径
        .style("fill", "#009966")		//指定节点的颜色
        .call(force.drag);				//允许节点可以拖拽

####5. 添加提示信息
这里，我们允许鼠标悬浮在节点上方的时候显示节点的名称。

    nodes.append("title").text(function (d) {
        return d.name;
    });

####6. 设置监听器
这里监听器设置为tick，主要用于监听tick事件以用于更新节点和连接的最新位置。打点（tick）操作的意思大致是使得每次初始化图形的时候，图形可以出现在一个新的位置。官方的解释如下：

> Runs the force layout simulation one step. This method can be used in conjunction with start and stop to compute a static layout. 


    force.on("tick", function() {
		  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

		   node.attr("cx", function(d) { return d.x; })
      	  .attr("cy", function(d) { return d.y; });
	});

####7. 响应鼠标的点击事件
这里我们允许浏览器响应用户点击节点的操作，每次点击的时候，我们可以在浏览器控制台中输出一条信息，表明用户点击了哪个点。

    nodes.on("click", function (d) {
        console.log("You clicked " + d.name);
    });