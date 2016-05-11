---
layout: post
title: Getting Started with Java Driver in MongoDB - CRUD
category: database
---

本文将简单介绍MongoDB Java Driver的开发，尤其是CRUD操作。具体的细节信息请阅读其API文档。使用Java driver非常的简单，首先你需要确保导入了 mongo.jar 包，推荐使用Maven作为项目构建工具，这样你可以轻松的管理依赖。其API地址如下：

>http://api.mongodb.org/
>
<!--more-->

###Using Maven to import Java Driver

首先使用在POM中加入MongoDB Java Driver

	<dependency>
	   <groupId>org.mongodb</groupId>
	   <artifactId>mongo-java-driver</artifactId>
	   <version>2.10.1</version>
	</dependency>

###DBObject and BasicDBObject

对应于MongoDB中的文档，在Java Driver中，使用DBObject接口来抽象该文档对象。DBObject类似于Java API中的Map接口，可以使用put方法向对象中加入Key/Value对。基本使用方法如下：

	BasicDBObject doc = new BasicDBObject();
		        doc.put("userName", "jyemin");
		        doc.put("birthDate", new Date(234832423));
		        doc.put("programmer", true);
		        doc.put("age", 8);
		        doc.put("languages", Arrays.asList("Java", "C++"));
		        doc.put("address", new BasicDBObject("street", "20 Main")
		                .append("town", "Westfield")
		                .append("zip", "56789"));

为了便于执行，我们定义一个统一的初始化语句，用于创建到MongoDB的连接：

    private static DBCollection createCollection() throws UnknownHostException {
        MongoClient client = new MongoClient();
        DB db = client.getDB("course");
        DBCollection collection = db.getCollection("TestCollection");
        //collection.drop(); //若存在该集合则删除该集合，重新创建
        return collection;
    }

###Insert

	DBObject doc = new BasicDBObject().append("x", 1);
    //DBObject doc2 = new BasicDBObject().append("x",2);

    collection.insert(doc);
    collection.insert(doc);//会导致 DuplicateKey 异常

###find, findOne, count

	//findOne
	DBObject one = collection.findOne();
		
	//findAll
	DBCursor cursor = collection.find();
	        try {
	          while (cursor.hasNext()) {
	              DBObject cur = cursor.next();
	              System.out.println(cur);
	          }
	        } finally {
	            cursor.close();
	        }
	
	//count
	long count = collection.count();

###Query criteria
	
	//方法1：传统方法
	DBObject query = new BasicDBObject("x",0).append("y", new BasicDBObject("$gt", 10).append("$lt", 90);   //查找所有 x:0, y:10到90之间 的文档，方法1
	long count = collection.count(query));   //执行
	
	//方法2：使用QueryBuilder
	QueryBuilder builder = QueryBuilder.start("x").is(0)
	                .and("y").greaterThan(10).lessThan(70);  //方法2：使用QueryBuilders
	
	long count = collection.count(builder.get());   //执行

###Field Selection
	DBObject query = QueryBuilder.start("x").is(0)
	                .and("y").greaterThan(10).lessThan(70).get(); //查询条件
	
	DBCursor cursor = collection.find(query,
	                new BasicDBObject("y", true).append("_id", false)); 
			//参数1：查询条件
			//参数2：字段过滤，只保留y字段
			//因为_id字段默认显示，所以要手动关闭_id字段
			//也可以用 1表示 true，0表示false

###Dot Notation

对于内嵌文档，可以直接使用点标记法进行嵌套查询。例如，有如下格式的一批文档：
	
	{ "_id" : 0 , "start" : { "x" : 85 , "y" : 84} , "end" : { "x" : 63 , "y" : 62}}

可以使用如下方式查询

	QueryBuilder builder = QueryBuilder.start("start.x").greaterThan(50);

    DBCursor cursor = lines.find(builder.get(),
            new BasicDBObject("start.y", true).append("_id", false)); //查询内部文档

    try {
        while (cursor.hasNext()) {
            DBObject cur = cursor.next();
            System.out.println(cur);
        }
    } finally {
        cursor.close();
    }

###Sort, Skip, and Limit

	DBCursor cursor = lines.find()
	                .sort(new BasicDBObject("start.x", 1).append("start.y", -1)) //排序：start.x升序，start.y降序
	                .skip(2).limit(10);  //忽略前2条记录，只显示10条

###Update and remove

	collection.update(new BasicDBObject("_id", "alice"),  //参数1：查询条件
	                new BasicDBObject("$set", new BasicDBObject("age", 24))); //参数2：更新内容
	
	collection.update(new BasicDBObject("_id", "frank"),
	                new BasicDBObject("$set", new BasicDBObject("age", 24)), true, false);
			//参数1：查询目标
			//参数2：更新操作
			//参数3：是否upsert，即若更新目标不存在，就添加该目标
			//参数4：是否multi，默认只更新第一条匹配项

###FindAndModify
	
默认情况下，返回更新前的查找结果，如果设置 returnNew 为 true的话，则返回更新后的的文档。

	public DBObject findAndModify(DBObject query,
                     DBObject fields,
                     DBObject sort,
                     boolean remove,
                     DBObject update,
                     boolean returnNew,
                     boolean upsert)

- query - specifies the selection criteria for the modification
- fields - a subset of fields to return
- sort - determines which document the operation will modify if the query selects multiple documents
- remove - when true, removes the selected document
- returnNew - when true, returns the modified document rather than the original
- update - the modifications to apply
- upsert - when true, operation creates a new document if the query returns no documents