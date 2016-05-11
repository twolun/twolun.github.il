---
title: Web日志关键指标可视化分析平台
category: works
icon: code-fork
tags: [visualization, hadoop, jersey, AngularJS, mongoDB]
figures:
  - src: "/img/project/seu-vislog.png"
    height: 180
public: false
---

本项目主要针对B2B网站在服务端生成的大量服务器日志进行分析处理，通过构建基于Hadoop等大数据平台的分析可视化工具，
用于还原用户的访问路径、分析站点的流量分布，从而获取用户的兴趣爱好和行为模型，最终为网站优化提供决策支持。

本项目为东南大学数据与智能实验室与[中国制造网](http://www.made-in-china.com)联合开发的实验性项目，数据来源于中国制造网的实际生产日志数据。
项目实施方案如下：

- 时间：2014年9月 - 2015年10月
- 数据处理和存储：Hadoop + MongoDB
- 服务器端：基于Jersey构建RESTful服务，使用Maven做依赖管理，使用GlassFish作为服务器
- 前端：基于Angular + D3.js构建可视化界面，直接消费服务端提供的REST接口