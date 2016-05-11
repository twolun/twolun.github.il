---
layout: post
title: 升级到MongoDB 3.0
category: technique
---

MongoDB 3.0的稳定版终于发布了，新版不仅强化了原有的MMAPv1存储引擎，还内置WiredTiger存储引擎，以及一个能减少运维人员日常例行工作的管理平台Ops Manager。MongoDB宣称，3.0新版本不只提升7到10倍的写入效率以及增加80％的数据压缩率，还能减少95％的运维成本。

<!--more-->


## 下载安装

下面的升级过程是在单机环境下完成的，如果是集群环境，请参考官方文档。

升级过程很简单，确保你的版本为2.6，然后关闭当前的MongoDB进程，并且安装3.0的二进制包即可，Windows版本需要更改一下环境变量（目录结构稍有变动）。

## 切换存储引擎为 WiredTiger

3.0默认的存储引擎依然为MMAPv1，你需要手动的将数据导出和重新导入。

### 1.启动MongoDB 3.0

	mongod --dbpath \data\db

### 2.导出数据
	
	mongodump --out \data\dump

### 3.创建WiredTiger存储目录

这里我在导出数据后，直接清空了`\data\db`目录，然后依然使用这个目录作为`WiredTiger`的存储目录。

### 4.使用WiredTiger引擎重启mongod

	mongod --storageEngine wiredTiger --dbpath \data\db

### 5.恢复数据

	mongorestore \data\dump

## WiredTiger

因为WiredTiger，MongoDB 3.0才能有文档级别的并行控制，即使处理频繁写入任务，数据库依然能维持效能一定的稳定度和可预测性。另外，用户可以自己选择储存数据的压缩比例，MongoDB 3.0提供最高达80％的压缩率，不过压缩率越高数据处理的时间成本也越多，用户可以自行权衡应用。

WiredTiger 存储引擎是一项全新的技术，提供无门闩、非堵塞算法来利用先进的硬件平台(如大容量芯片缓存和线程化架构)来提升性能。通过 WiredTiger ，MongoDB 3.0 实现了文档级别的并发控制，因此大幅提升了大并发下的写负载。透明的磁盘压缩技术减少对存储的容量要求达 80%。此外 MongoDB 原先的存储引擎也得到了增强，包括集合级别并发控制以及更高效的日志，现在称为 MMAPv1。

## References

1. http://docs.mongodb.org/master/release-notes/3.0/
2. http://news.mydrivers.com/1/393/393579.htm