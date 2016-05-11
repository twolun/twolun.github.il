---
layout: post
title: Web Application Dev. based on MongoDB using Java - An Introduction
category: database
---

对于web开发而言，很多时候我们并不需要复杂的关系数据库，并且关系数据库要求严格的模式定义，而这很多时候并不适用于web上大量的无结构信息。近年来，追着NoSQL的兴起，使得我们更多的开始关注如何有效的存储和处理无结构的web信息。本文将简要的介绍MongoDB的web开发基本过程。
<!--more-->

###Introduction
MongoDB是一款为Web应用程序和互联网基础设施设计的开源的NoSQL数据库管理系统,MongoDB使用C++开发。MongoDB最吸引人的地方在于使用直观的文档作为数据模型，这样可以摆脱关系数据库复杂的多表关联导致的复杂性。这里需要记住几个关键词：

- 面向文档
- 动态的模式schema
- 不支持Join操作、不支持SQL
- 即时查询 ad hoc query （无需预定义系统接受的查询类型）

其他的特点可以查看阅读mongoDB的官方文档，这里不进行赘述：

- MongoDB简介：http://docs.mongodb.org/manual/core/introduction/
- MongoDB安装：http://docs.mongodb.org/manual/installation/
- http://docs.mongodb.org/manual/tutorial/getting-started/

###Basic Operation

安装好MongoDB后，首先要启动MongoDB的和核心服务器，使用`mongod`指令，后面需要指明数据库存放的文件路径：

	mongod --dbpath d:/data/db

然后启动MongoDB的JavaScript Shell, 显然，MongoDB的命令行shell是基于JavaScript的，其用于管理数据库和操作数据。进入shell后最常用的命令如下：
	
	db			//显示当前数据库
	show dbs	//显示所有数据库
	use DB		//切换到目标数据库DB
	
	show collections			//显示当前数据库下的所有集合
	db.COLLECTION.findOne();	//查看当前数据库下集合COLLECTION中的一条文档

其他的命令这里也不再赘述，CRUD操作可以参考MongoDB的详细官方文档：

	http://docs.mongodb.org/manual/core/crud-introduction/

###Import JSON to MongoDB
可以使用以下命令将一个JSON文档直接导入到MongoDB中

	mongoimport -d students -c grades < grades.json
		//-d 数据库名
		//-c 集合名


###Application Architecture

![Application Architecture](/img/posts/141026-mongo-arch.PNG)

- Database: MongoDB
- Server-side: SparkJava Framework etc.
- Client-side: FreeMarker etc.

###BSON - Binary jSON

MongoDB用来表示文档的二进制格式，它既是存储格式，也是命令格式。所有文档都已BSON格式存储在磁盘上，所有查询和命令都用BSON文档来指定。

###Maven

我们使用Maven作为项目构建工具。我们将启动一个Maven初始模版（app-start）作为我们开发的起点。启动项目后，首先在pom中加入sparkjava，sparkjava是一个轻型的MVC框架：

	<dependency>
		<groupId>com.sparkjava</groupId>
		<artifactId>spark-core</artifactId>
		<version>1.1.1</version>
	</dependency>

需要注意的是，最新版的sparkjava为2.0.0.0，需要java8的支持，如果你未使用java8的话，就必须退回到旧版本，这里我们使用1.1.1版本，该版本支持java7。 sparkjava项目的官方地址为：

	http://www.sparkjava.com/

然后，我们将freemarker的相关配置信息加入pom中：
	
	<dependency>
		<groupId>org.freemarker</groupId>
		<artifactId>freemarker</artifactId>
		<version>2.3.19</version>
	</dependency>

###MongoDB Java Driver

最后，加入mongodb的java driver:

	<dependency>
       <groupId>org.mongodb</groupId>
       <artifactId>mongo-java-driver</artifactId>
       <version>2.10.1</version>
    </dependency>

为了验证以上的步骤是否正确，我们编写如何的测试代码，用于测试MongoDB是否能正常工作（注意，前提是你必须先启动mongod应用服务器）：

	MongoClient client = new MongoClient(new ServerAddress("localhost", 27017));
		
	DB database = client.getDB("course");
	DBCollection collection = database.getCollection("hello");
		
	DBObject document = collection.findOne();
	System.out.println(document)；

###Summary
本文简单介绍了基于MongDB的web应用开发的基本结构，以及各项组件在应用中的作用。今后，会再利用一两篇博客具体介绍基于mongoDB的web开发的具体细节，包括如何使用sparkjava+freemarker。以及使用以上谈到的技术构建一个简单的博客系统。
