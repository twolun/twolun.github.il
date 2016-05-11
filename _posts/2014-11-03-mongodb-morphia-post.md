---
layout: post
title: MongoDB Persistence with Java and Morphia
category: database
---

本文将介绍MongoDB的Morphia项目，该项目用来提供Java对象与mongodb之间的映射，类似于关系数据库的ORM映射，我们称之为ODM映射，即对象文档映射。Morphia基于注解，支持嵌套文档与对象之间的映射，支持引用、查询更新、运行时验证等。Morphia项目地址为：

>https://github.com/mongodb/morphia
<!--more-->

###在项目中引入morphia
我们使用Maven作为构建工具，为了使用morphia，我们需要在Pom中加入如下的依赖，分别为mongodb的java驱动，以及Morphia：

    <dependency>
        <groupId>org.mongodb</groupId>
        <artifactId>mongo-java-driver</artifactId>
        <version>2.10.1</version>
    </dependency>

    <dependency>
        <groupId>org.mongodb.morphia</groupId>
        <artifactId>morphia</artifactId>
        <version>0.108</version>
    </dependency>

下面将介绍使用Morphia的基本流程，截取部分代码作为示例，示例程序的完整源代码请查阅[1]。

###POJO with Morphia Annotation

如果你想要将一个类的实例通过Morphia存储在Mongo中，首先要做的事实定义POJO类，并使用@Entity注解。默认情况下会将类名存储到文档中，通过设定`noClassnameStored = true`来取消该选项。value后面的值表示对应Mongo中的表名。

	import org.mongodb.morphia.annotations.Entity;
	//...

	@Entity (value = "users", noClassnameStored = true)
	@Indexes({
	        @Index(value = "username, -followers", name="popular"),
	        @Index(value ="lastActive", name="idle", expireAfterSeconds = 1000000000)
	})
	public class GithubUser {
	
	    @Id
	    public String userName;
	    public String fullName;
	
	    @Property("since")
	    public Date memberSince;
	    @Reference(lazy = true)
	    public List<Repository> repositories = new ArrayList<>();
	
	    public int followers = 0;
	    public int following = 0;
	
	    public GithubUser(){
	    }
	
	    public GithubUser(final String userName){
	        this.userName = userName;
	    }
	}

- @id对应于Mongo中的 _id 字段
- @Indexes用于设定索引
- @Embeded 内嵌文档
- @Reference 用于引用数据库中的另一个文档

下面说明如何使用@Embeded注解和@Reference注解。

需要注意的是，被Reference的对象必须在引用之前保存，然后才能保存引用该对象的对象。默认情况下Morphia使用字段名作为key值在Mongo中查找对应的Key，你可以使用`@Reference("blog_authors")`来自定义搜索的key值。

	@Entity("repos")
	public class Repository {
	    @Id
	    public String name;
	    @Reference
	    public Organization organization;
	
	    @Reference
	    public GithubUser owner;
	    public Settings settings = new Settings();
		
		//other code
	}

注意，Embeded类是没有@Id注解的。

	@Embedded
	public class Settings {
	    public String defaultBranch = "master";
	    public Boolean allowWiki = false;
	    public Boolean alloIssues = true;
	}

###Mapping Objects

一旦我们注解好了对象，那么就完成了任务的一半。现在我们需要做的是创建Morphia的实例，说明我们需要映射的类，然后就可以在Java对象和Mongo文档间建立映射关系了。

Datasore是对MongoDB CRUD操作的封装。对每一种操作，你可以指定目标类和具体的参数。Morphia的最新版本（目前最新为0.108）的API地址为：

> https://rawgit.com/wiki/mongodb/morphia/javadoc/0.108/apidocs/index.html

	Morphia morphia = new Morphia();
    Datastore datastore = morphia.createDatastore(new MongoClient(),"morphia-demo");//初始化数据库名为morphia-demo
    morphia.mapPackage("my.package.with.only.mongo.entities");
	datastore.ensureIndexes();

你可以使用map方法来映射对应的类。另外，也可以用mapPackage来指定要映射的包。Morphia将会自动扫描该包，并映射该包中发现的所有类。关于本部分更详细的内容可以参考:

> https://github.com/mongodb/morphia/wiki/MappingObjects

###Create

    GithubUser evanchooly = new GithubUser("evanchooly");
    evanchooly.fullName = "Justin Lee";
    evanchooly.memberSince = date;
    evanchooly.following = 1000;

    datastore.save(evanchooly);

涉及到引用的插入操作，你必须先保存被引用的对象，然后再保存引用其他对象的对象：

    Organization org = new Organization("mongodb");
    datastore.save(org);

    Repository morphia1 = new Repository(org, "morphia");
    Repository morphia2 = new Repository(evanchooly, "morphia");

    datastore.save(morphia1);
    datastore.save(morphia2);

    evanchooly.repositories.add(morphia1);
    evanchooly.repositories.add(morphia2);

    datastore.save(evanchooly);

###Query

    Query<Repository> query = datastore.createQuery(Repository.class);

    Repository repository = query.get();

    List<Repository> repositories = query.asList();

    Iterable<Repository> fetch = query.fetch();
    ((MorphiaIterator)fetch).close();
    
    Iterator<Repository> iterator = fetch.iterator();
    while(iterator.hasNext()) {
        iterator.next();
    }
    
    iterator = fetch.iterator();
    while(iterator.hasNext()) {
        iterator.next();
    }

    query.field("owner").equal(evanchooly).get();

    GithubUser memberSince = datastore.createQuery(GithubUser.class).field("memberSince").equal(date).get();
    System.out.println("memberSince = " + memberSince);
    GithubUser since = datastore.createQuery(GithubUser.class).field("since").equal(date).get();
    System.out.println("since = " + since);

###Update

    evanchooly.followers = 12;
    evanchooly.following = 678;
    datastore.save(evanchooly);

如果需要进行大量的更新可以使用如下方式：

	UpdateOperations<GithubUser> update = datastore.createUpdateOperations(GithubUser.class).inc("followers").set("following", 42);
    Query<GithubUser> query = datastore.createQuery(GithubUser.class).field("followers").equal(0);
    datastore.update(query, update);

###Using Data Access Objects (DAO)
一个更好的开发实践是使用DAO来封装调用持久化的过程。Morphia提供了一个抽象的`BasicDAO`实现来支持该风格。我们可以使用如下的方式使用DAO：我们需要创建一个DAO类去继承`BasicDAO<T,V>`:

	import com.mongodb.Mongo;
	import org.mongodb.morphia.Morphia;
	import org.mongodb.morphia.dao.BasicDAO;
	...
	public class BlogEntryDAO extends BasicDAO<BlogEntry, ObjectId> {
	    public BlogEntryDAO( Morphia morphia, Mongo mongo ) {
	        super(mongo, morphia, "myBlogDb");
	    }
	}

DAO已经为我们完成了绝大部分的工作，我们只需要做两件事：

1. 实现构造器，构造器将传递信息给DAO超类。
2. 实现finder方法。

下面我们以持久化和载入博客条目为例进行说明：

	...
	BlogEntryDAO blogEntryDAO = new BlogEntryDAO(...);
	
	// get one specific blog entry
	ObjectId  blogEntryId = ...;
	BlogEntry myBlogEntry = blogEntryDAO.get(blogEntryId);
	
	// update it
	myBlogEntry.setTitle("My Blog Entry");
	blogEntryDAO.save(myBlogEntry);
	
	// or just delete it
	blogEntryDAO.deleteById(myBlogEntry.getId());
	...

在Web开发中，我们通常使用依赖注入框架（例如Guice或Srping）来将依赖注入到DAO中，然后将DAO注入到控制器中，这样做可以很好的屏蔽各层间的实现细节。

虽然抽象的DAO实现已经有了find()方法，但有时我们需要自定义finder方法来过滤数据，那么我们可以在BlogEntryDAO中加入如下方法：

	public List<BlogEntry> findByTitle( String title ) {
	    Pattern regExp = Pattern.compile(title + ".*", Pattern.CASE_INSENSITIVE);
	    return ds.find(entityClazz).filter("title", regExp).sort("title").asList();
	}

###References

1. https://github.com/evanchooly/morphia-demo
2. https://github.com/mongodb/morphia/wiki/DAOSupport
2. https://rawgit.com/wiki/mongodb/morphia/javadoc/0.108/apidocs/index.html
3. https://github.com/mongodb/morphia/wiki