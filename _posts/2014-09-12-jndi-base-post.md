---
layout: post
title: JNDI - Java Naming and Directory Interface
category: technology
---

###JNDI Concept

JNDI，即JAVA命名及目录接口，是Java EE的重要规范之一，它也是EJB的一个重要组成部分。那么到底什么是JNDI呢？维基百科的正式解释如下：

> The Java Naming and Directory Interface (JNDI) is a Java API for a directory service that allows Java software clients to discover and look up data and objects via a name. Like all Java APIs that interface with host systems, JNDI is independent of the underlying implementation. Additionally, it specifies a service provider interface (SPI) that allows directory service implementations to be plugged into the framework. It may make use of a server, a flat file, or a database; the choice is up to the vendor.
<!--more-->
大概解释如下，JNDI是Java平台的一个标准扩展，提供了一组接口、类和关于命名空间的概念。如同其它很多Java技术一样，JDNI是provider-based的技术，暴露了一个API和一个服务供应接口（SPI）。这意味着任何基于名字的技术都能通过JNDI而提供服务，只要JNDI支持这项技术。JNDI目前所支持的技术包括LDAP、CORBA Common Object Service（COS）名字服务、RMI、NDS、DNS、Windows注册表等等。很多J2EE技术，包括EJB都依靠JNDI来组织和定位实体。 

JDNI通过绑定的概念将对象和名称联系起来。在一个文件系统中，文件名被绑定给文件。在DNS中，一个IP地址绑定一个URL。在目录服务中，一个对象名被绑定给一个对象实体。 
JNDI中的一组绑定作为上下文来引用。每个上下文暴露的一组操作是一致的。例如，每个上下文提供了一个查找操作，返回指定名字的相应对象。每个上下文都提供了绑定和撤除绑定名字到某个对象的操作。JNDI使用通用的方式来暴露命名空间，即使用分层上下文以及使用相同命名语法的子上下文。 

####Naming service

到底什么是命名服务，其实DNS就是一种命名服务，DNS将域名与IP地址进行映射，因为域名显然比IP地址更容易被人记住。生活中，身份证号码和人名形成一种映射关系，这也是一种命名服务。以此，我们可以看出命名服务的特点:一个值和另一个值的映射,将我们人类更容易认识的值同计算机更容易认识的值进行一一映射。

理解了命名服务和目录服务再回过头来看JDNI,它是一个为Java应用程序提供命名服务的应用程序接口,为我们提供了查找和访问各种命名和目录服务的通用统一的接口.通过JNDI统一接口我们可以来访问各种不同类型的服务。JNDI在JAVA应用的作用如下图所示：

![JNDI](/img/posts/140912-jndi.png)

###JNDI Example: JDBC　Data Source

显然，光凭概念并不能准确的理解JNDI的作用到底是什么。下面看一个例子：传统上，我们使用JDBC访问MySql数据库的时候，需要对MySql的驱动类进行引用编码，并通过适当的JDBC URL连接到数据库。如下方式：

	Connection conn = null;
	Class.forName("com.mysql.jdbc.Driver", true, Thread.currentThread().getContextClassLoader());
	conn=DriverManager.getConnection("jdbc:mysql://MyDBServer?user=admin&password=admin");  
	//......  
	conn.close();

###Why JNDI?

这是传统的数据库访问方式，但这样做可能会存在如下的问题：
	
1. 数据库服务器名称MyDBServer 、用户名和口令都可能需要改变，由此引发JDBC URL需要修改；
2. 数据库可能改用别的产品，如改用DB2或者Oracle，引发JDBC驱动程序包和类名需要修改；
3. 随着实际使用终端的增加，原配置的连接池参数可能需要调整；
4. ......

这一系列问题的解决思路是使用JNDI，JNDI的思路是程序员不需要关心“具体的数据库是什么，JDBC的驱动程序是什么，JDBC URL的格式是什么，访问数据库的用户名和口令是什么”。 程序员编写的程序应该没有对 JDBC 驱动程序的引用，没有服务器名称，没有用户名称或口令 —— 甚至没有数据库池或连接管理。而是把这些问题交给J2EE容器来配置和管理，程序员只需要对这些配置和管理进行引用即可。

JNDI提出的一个最主要目的是：解耦，从而使得程序更加可维护、可扩展。***JNDI的解决思路是，在J2EE容器中配置JNDI参数，定义一个数据源，也就是JDBC引用参数，给这个数据源设置一个名称；然后，在程序中，通过数据源名称引用数据源从而访问后台数据库。***也就是说，JNDI是由J2EE容器提供的功能，如tomcat, glassfish等。

我们将数据源信息（包括JDBC的URL，驱动类名，用户名和密码等）配置在J2EE容器中，从而在程序中直接获得配置在J2EE容器中的数据源信息。这样，程序员将不用关心具体的数据库的配置细节，而是通过JNDI的查询语句查询数据源的名称直接获得数据源信息。

	Context ctx=new InitialContext();  
	Object datasourceRef=ctx.lookup("java:MySqlDS"); //引用数据源

由此可见，JNDI避免了程序 与数据库之间的紧耦合，使应用更加易于配置、易于部署。JNDI在满足了数据源配置的要求的基础上，还进一步扩充了作用：所有与系统外部的***资源***的引用，都可以通过JNDI定义和引用。

所以，在J2EE规范中，J2EE 中的资源并不局限于 JDBC 数据源。引用的类型有很多，其中包括资源引用（已经讨论过）、环境实体和 EJB 引用。特别是 EJB 引用，它暴露了 JNDI 在 J2EE 中的另外一项关键角色：***查找其他应用程序组件***。

EJB 的 JNDI 引用非常类似于 JDBC 资源的引用。在服务趋于转换的环境中，这是一种很有效的方法。可以对应用程序架构中所得到的所有组件进行这类配置管理，从 EJB 组件到 JMS 队列和主题，再到简单配置字符串或其他对象，这可以降低随时间的推移服务变更所产生的维护成本，同时还可以简化部署，减少集成工作。外部资源”。

###小结

J2EE 规范要求所有 J2EE 容器都要提供 JNDI 规范的实现。JNDI 在 J2EE 中的角色就是“交换机” —— J2EE 组件在运行时间接地查找其他组件、资源或服务的通用机制。在多数情况下，提供 JNDI 供应者的容器可以充当有限的数据存储，这样管理员就可以设置应用程序的执行属性，并让其他应用程序引用这些属性（Java 管理扩展（Java Management Extensions，JMX）也可以用作这个目的）。JNDI 在 J2EE 应用程序中的主要角色就是提供间接层，这样组件就可以发现所需要的资源，而不用了解这些间接性。

在 J2EE 中，JNDI 是把 J2EE 应用程序合在一起的粘合剂，JNDI 提供的间接寻址允许跨企业交付可伸缩的、功能强大且很灵活的应用程序。这是 J2EE 的承诺，而且经过一些计划和预先考虑，这个承诺是完全可以实现的。


从上面的文章中可以看出：

1. JNDI 提出的目的是为了解藕，是为了开发更加容易维护，容易扩展，容易部署的应用。
2. JNDI 是一个sun提出的一个规范(类似于jdbc),具体的实现是各个j2ee容器提供商，sun   只是要求，j2ee容器必须有JNDI这样的功能。
3. JNDI 在j2ee系统中的角色是“交换机”，是J2EE组件在运行时间接地查找其他组件、资源或服务的通用机制。
4. JNDI 是通过资源的名字来查找的，资源的名字在整个j2ee应用中(j2ee容器中)是唯一的。


###References:

1. http://en.wikipedia.org/wiki/Java_Naming_and_Directory_Interface
2. http://docs.oracle.com/javase/jndi/tutorial/
3. http://blog.csdn.net/zhaosg198312/article/details/3979435
4. http://developer.51cto.com/art/201112/310774.htm
5. http://blog.csdn.net/jnqqls/article/details/7167517
6. http://blog.csdn.net/zhaosg198312/article/details/3979435
7. 在Tomcat中配置JNDI数据源 http://tomcat.apache.org/tomcat-7.0-doc/jndi-resources-howto.html