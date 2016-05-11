---
layout: post
title: DAO Implementation Using Static Factory Method
category: database
---

一般对于同一个系统而言，为了可扩展性考虑，通常可能会涉及到多种数据持久化方式。例如系统中同时存在MySQL和MongoDB等，为此我们通常使用Data Access Object(DAO)来抽象和封装所有的数据源对象。DAO负责建立与数据源的连接，获取和存储数据。

<!--more-->
对于多个数据源情况下，可以使用静态工厂方法模式进行DAO的设计。本文中，我们假设系统中存在MongoDB, MySQL, Oracle等数据库，通过简单的实例来介绍一个简单通用的DAO设计流程：


###Abstract class DAO Factory

	// Abstract class DAO Factory
	public abstract class DAOFactory {  
		// List of DAO types supported by the factory  
		public static final int MongoDB = 1;  
		public static final int ORACLE = 2;  
		public static final int MySQL = 3;  
		...  
		// There will be a method for each DAO that can be   
		// created. The concrete factories will have to   
		// implement these methods.  
		public abstract ScenicDAO getScenicDAO();  
		public abstract CityDAO getCityDAO();  
		...  
		public static DAOFactory getDAOFactory(int whichFactory) {      		
			switch (whichFactory) {      
				case MongoDB	: return new MongoDBDAOFactory();      
				case ORACLE     : return new OracleDAOFactory();            
				case MySQL    	: return new MySQLDAOFactory();      
				...      
				default         : return null;    
			}  
		}
	}

###Concrete DAOFactory Implementation for MongoDB

工厂用于获得具体的DAO实现，但屏蔽其具体的实现。
	
	public class MongoFactory extends DAOFactory {
		public static final String mongoURIString = "mongodb://localhost";
		public static final String dbName = "itravel";
		
		public static DB getDB() {
			MongoClient mongoClient;
			DB travelDB = null;
			try {
				mongoClient = new MongoClient(new MongoClientURI(mongoURIString));
				travelDB = mongoClient.getDB(dbName);
			} catch (UnknownHostException e) {
				e.printStackTrace();
			}
			return travelDB;
		}
		
		public CityDAO getCityDAO() {
			return new CityDAO();
		}
		
		public ScenicDAO getScenicDAO() {
			return new ScenicDAO();
		}
	}

###DAO Implementation for City

在实现具体的DAO的时候，通常你也可以先设计一个DAO接口，然后再实现该接口定义其具体的数据访问行为。但对于小型应用而言，通常不会涉及太多的数据访问方法，因此，这里为了简化其间，直接实现了DAO。

	public class CityDAO {
		DBCollection cityCollection;
		
		public CityDAO() {
			cityCollection = MongoFactory.getDB().getCollection("cities");
		}
		
		public List<DBObject> findCityList() {
			List<DBObject> cities;
			DBObject query = QueryBuilder.start().get();
			DBCursor cursor = cityCollection.find( query, new BasicDBObject("name", true).append("_id", false))
					.sort(new BasicDBObject().append("name", -1));
			cities = cursor.toArray();
			cursor.close();
			
			return cities;
		}
	}

###Demo
	
	//Get the DAO for city collection
	CityDAO dao = new MongoFactory().getCityDAO();
	//Execute the specific methods
	List<DBObject> result = dao.findCityList();

###Related Patterns

1. Factory Method [GoF] and Abstract Factory [GoF]: 

	>The Factory for Data Access Objects Strategy uses the Factory Method pattern to implement the concrete factories and its products (DAOs). For added flexibility, the Abstract Factory pattern may be employed as discussed in the strategies.

2. Broker [POSA1]

	>The DAO pattern is related to the Broker pattern, which describes approaches for decoupling clients and servers in distributed systems. The DAO pattern more specifically applies this pattern to decouple the resource tier from clients in another tier, such as the business or presentation tier

###References

1. http://www.oracle.com/technetwork/java/dataaccessobject-138824.html