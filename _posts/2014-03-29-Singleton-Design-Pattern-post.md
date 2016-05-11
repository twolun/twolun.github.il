---
layout: post
title: Java Singleton Design Pattern
category: technology
---
Singleton pattern is one of the most commonly used patterns in Java. It is used to control the number of objects created by preventing external instantiation and modification. That is to say, at any time there can only be one instance of singleton (object) created by the JVM.

<!--more-->
####How to construct:
- private constructor
- private reference 
- public static method is the only place that can get an object

####Implementation of Singleton Pattern
**Step one**, provide a default private constructor
    
    public class Singleton {
        //set the default constructor as private
        private Singleton(){
        }
    }

**Step two**, create a method for getting the reference of this singleton object
    
    private statci Singleton singletonObject = null;
    
    public static Singleton getSingletonInstance(){
        if (singletonObject == null){
            singletonObject = new Singleton();
        }
        return singletonObject;
    }
    
**Step three**, make the access method synchronized to prevent thread problem
    
    public static synchronized Singleton getSingletonInstance(){
        //ignore the code segment
    }
    
**Step four**, override the Object clone method to prevent cloning

    public Object clone() throws CloneNotSupportedException {
		throw new CloneNotSupportedException();
	}

The Singleton's purpose is to control object creation, limiting the number of obejcts to one only. Since there is only one Singleton instance, any instance fields of a Singleton will occur only once per class, just like static fields. Singletons often control access to resources such as database connections or sockets.

For example, if you have a license for only one connection for your database or your JDBC driver has trouble with multithreading, the Singleton makes sure that only one connection is made or that only one thread can access the connection at a time.
	
**At last**, we have a singleton class (with full source code) as follows:

    public class Singleton {
    
         private statci Singleton singletonObject = null;
        
        //set the default constructor as private
        private Singleton(){
            //init    
        }
    
        public static synchronized Singleton getSingletonInstance(){
            if (singletonObject == null){
                singletonObject = new Singleton();
            }
            return singletonObject;
        }
        
        public Object clone() throws CloneNotSupportedException {
		    throw new CloneNotSupportedException();
	    }
    }

References:

 - http://www.javabeginner.com/learn-java/java-singleton-design-pattern
 - http://www.programcreek.com/