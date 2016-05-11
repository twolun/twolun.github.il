---
layout: post
title: 基于MongoDB开发轻量级web应用——以博客为例
category: technique
---

本文旨在说明基于MongoDB的web应用开发的基本流程，即如何使用MongoDB来替代传统的关系数据库。对轻量级应用而言，使用MongoDB的最大好处是可以快速的进行数据库设计，无需复杂的模式定义。并且MongoDB易伸缩，文档结构灵活，尤其适合以查询为主的web应用。

<!--more-->

本项目使用Java进行开发，数据库选用的是MongoDB。因为涉及到Java Web的开发，因此选用了两个轻量级的框架，与前端通信的模版框架Freemarker，一个小型MVC框架Spark-java。如果你对这些内容和MongoDB还不了解，可以先阅读[这篇文章](http://wwsun.me/posts/mongodb-1-post.html)。

本项目使用Maven作为依赖管理工具。因此需要按照上面的文章配置好依赖。本项目的来源是`MongoDB University`的`M101J`课程中涉及到的一个小项目，你可以参加[该课程](https://university.mongodb.com/)获得详细的MongoDB开发知识。

###源码获取
你可以使用git使用下面的指令获得项目的全部代码：

	git clone https://github.com/wwsun/sun-mongodb-blog


###项目组织
Spark-java内置使用`jetty`作为运行容器，因此你无需安装任何web服务器软件。下面介绍具体的开发流程，主要文件如下：

- BlogController 控制器文件，充当Mongo工厂、路由配置等功能
- BlogPostDAO\ SessionDAO\ UserDAO 数据访问类，涉及所有的Mongo读写操作
- `resources/freemarker/*`项目的视图文件

###控制器
使用一个main函数作为启动服务器的入口。main函数可以传递一个string参数作为MongoDB的服务器地址。如下：

	public static void main(String[] args) throws IOException {
        if (args.length == 0) {
            new BlogController("mongodb://localhost");
        }
        else {
            new BlogController(args[0]);
        }
    }

为了简单起见，我们在控制器的构造函数中初始化所有的DAO访问组件、以及建立与Mongo的连接。以下为代码片段，详细的代码请参考你下载下来的源码。

    public BlogController(String mongoURIString) throws IOException {
        final MongoClient mongoClient = new MongoClient(new MongoClientURI(mongoURIString));
        final DB blogDatabase = mongoClient.getDB("blog");

        blogPostDAO = new BlogPostDAO(blogDatabase);
        userDAO = new UserDAO(blogDatabase);
        sessionDAO = new SessionDAO(blogDatabase);

        cfg = createFreemarkerConfiguration();
        setPort(8082);
        initializeRoutes();
    }

###页面路由配置
这里简单介绍Spark-java的页面路由规则。路由是Spark-java的主要构建模块。一个路由通常由三部分组成：

1. A verb (get, post, put, delete, head, trace, connect, options)
2. A path (/hello, /users/:name)
3. A callback (request, response) -> { }

下面示范一个简单的路由示例：

    get(new FreemarkerBasedRoute("/", "blog_template.ftl") {
        @Override
        public void doHandle(Request request, Response response, Writer writer) throws IOException, TemplateException {

            SimpleHash root = new SimpleHash();

            root.put("msg", "Hello");
            template.process(root, writer);
        }
    });

spark-java最新版本按照jdk1.8进行了重构，大量使用了lambda表达式，因此，如果你用的是最新版本的spark-java需要相应的更改路由规则，例如：

	// matches "GET /hello/foo" and "GET /hello/bar"
	// request.params(":name") is 'foo' or 'bar'
	get("/hello/:name", (request, response) -> {
	    return "Hello: " + request.params(":name");
	});

你可以参考Spark-java的[最新文档](http://sparkjava.com/documentation.html)获取更多的用法。

###DAO
在DAO涉及到的是所有的数据访问方法。这涉及到MongoDB的Java API的相关知识，你可以参考[这篇文章](http://wwsun.me/posts/mongodb-java-crud-post.html)获得MongoDB Java API的相关入门知识。

这里我们提供一个简单的开发示例。例如我们想获取所有的博客文章以显示在主页上，可以使用下面的代码块：

    public List<DBObject> findByDateDescending(int limit) {
        List<DBObject> posts;
        DBCursor cursor = postsCollection.find().sort(new BasicDBObject().append("date", -1)).limit(limit);
        try {
            posts = cursor.toArray();
        } finally {
            cursor.close();
        }
        return posts;
    }

###References
1. http://wwsun.me/posts/mongodb-java-crud-post.html
2. https://github.com/wwsun/sun-mongodb-blog
3. http://sparkjava.com/documentation.html