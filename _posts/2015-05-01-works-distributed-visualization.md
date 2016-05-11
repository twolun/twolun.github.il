---
title: 一个分布式的数据分析及可视化方案
category: works
icon: code-fork
tags: [node.js, AngularJS, hadoop, restful, mongoDB]
figures:
  - src: "/img/project/distributed-vis.png"
    height: 160
public: false
---

本项目是针对大型数据集的一个分布式数据可视化方案，该方案由三部分组成，可视化前端、数据服务端、以及数据预处理和存储端。
本项目实现一个可视化分析的基础原型系统。

- 前端负责数据可视化，是一个由AngularJS和D3构建的单页可视化应用，运行在一个Node容器中，负责消费来自异构服务端的请求
- 数据服务端是基于Jersey构建的RESTful服务，负责获取数据并运行特定的数据分析及挖掘算法，并向上层提供Web服务
- 数据预处理是一组MapReduce程序，运行在Hadoop集群上，结果会输出到MongoDB中