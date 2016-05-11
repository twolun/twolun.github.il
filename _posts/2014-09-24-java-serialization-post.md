---
layout: post
title: Java的对象序列化
category: technology
---

###为什么需要序列化

你所创建的对象会随着程序的终止而不复存在，但是，在某些情况下，我们还是希望能够在程序不运行的情况下仍能存在并保存其信息。显然，通过将信息写入文件或数据库可以达到这个目的，但是如果能够声明一个对象为“持久性”的，并为我们处理所有细节，那将会显得十分方便。
<!--more-->
Java的对象序列化将那些实现了Serializable接口的对象转换成一个字节序列，并能在以后将这个直接完全恢复为原来的对象。这一过程甚至可以在网络进行。

序列化实现了Java的轻量级持久性。“持久性”意味着一个对象的生存周期并不取决于程序是否正在执行，它可以生存于程序的调用之间。通过将一个序列化对象写入磁盘，然后在重新调用程序时恢复该对象，就能够实现持久性的效果。“轻量级”在于其需要在程序中显示的序列化与反序列化。

之所以需要对象序列化，主要基于两点考虑：

1. Java的远程方法调用RMI，它事存活于其他计算机上的对象使用起来就像是存活于本机上一样。但远程对象发送消息时，需要通过对象序列化来传输参数和返回值。
2. Java Beans的需要。使用一个Bean时，一般情况下需要在设计阶段对他的状态信息进行配置。这种状态信息必须保存下来，并在程序启动时进行后期恢复，这种工作就是由对象序列化来完成的。

###如何进行对象序列化

1. 让需要序列化的类实现Serializable接口
2. 提供静态的long型的常量serialVersionUID
3. 序列化一个对象：首先要创建某些OutputStream对象，然后将其封装在一个ObjectOutputStream对象内。这时，调用writeObject()即可将对象序列化，并将其发送给OutputStream。
4. 反序列化：将一个InputStream封装在ObjectInputStream内，然后调用readObject()。
5. 关闭流

具体的例子请参考如下链接：
	
	http://www.tutorialspoint.com/java/java_serialization.htm

###为什么需要serialVersionUID
在Java中，软件的兼容性是一个大问题，尤其在使用到对象串行性的时候，那么在某一个对象已经被串行化了，可是这个对象又被修改后重新部署了，那么在这种情况下， 用老软件来读取新文件格式虽然不是什么难事，但是有可能丢失一些信息。 serialVersionUID来解决这些问题，新增的serialVersionUID必须定义成下面这种形式：

	static final long serialVersionUID=-2805284943658356093L;

其中数字后面加上的L表示这是一个long值。 通过这种方式来解决不同的版本之间的串行话问题。

###References:
1. Thinking in Java, chapter 18
2. http://www.tutorialspoint.com/java/java_serialization.htm