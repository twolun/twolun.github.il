---
layout: post
title: A Simple Distibuted System Desingn based on Java Socket
author: Weiwei
tags:
  - java socket
  - distributed system
---
> Abstract: This post is a simple summary of a distributed flight booking center.This Flight Booking Center is an online system that allows user to search for, compare rates, check availability, and buy e-tickets of International flights that are carried by different airlines.

<!--more-->
####Overview:
This distributed Flight Booking Center based on Java Socket, and the system will follow the design principal of MVC (Model-View-Controller). To support the data access, the JDBC acts as a middle-ware tool and MySQL acts as a database will be used in this system.    

To facilitate the version control of this project, Git is selected as a version control tool and Github is taken as a remote repository. Therefore, you also can get the sources codes using the following commands:

    $git clone https://github.com/wwsun/flight-tickets-service.git


####System logic:
Figure 1 shows the system logic and message passing path, all the message should be handled by the proxy server, then distribute to the specific server(s). In this system, HOPP (Half-object plus Protocol) is designed for separating different logics, that is to say, some business logics should be extracted out as an independent class. Especially in the proxy server, two different HOPPs are developed to separate two different logics, CM (communication module) could invoke the methods of PSHOPP to execute different services, and PSHOPP could invoke the methods providing by PCHOPP to execute the real logics that communicate with the CM of airline server.

![system logic structure](/images/blog/hopp.png)
Figure 1

####Text protocol design:
The text protocol used to specify the standards what the uers should follow, someone else could use this format to expand the system, such as design a graphic user interface. It will be useful to design the text protocol, and it will be helpful for someone else to understand the message passing of this syste. In this system, the text protocol was designed as follows:
    
    query <from, to, leaveTime>
    query <from, to, leaveTime, returnTime>
    reg <airline, username, phone, email, creditcard>
    order <fid1, fdi2, username>
    order <fid, username>
    check <airline, username>
    (the specific infomation should be find in the documentation which can be found in github project)
    
####Database design:(skip)

####Functions design:
This system will implement the core function of flight listing, flight querying (based on the departure city and destination city, or the leaving time and returning time), and flight checking which are needed in a real Flight Booking system.    

In this system, only two-way (return trip), direct (one stop) International flights operated by various airlines between cities in Australia and China are considered. That is to say, domestic flights (e.g. Shanghai to Beijing) are not supported in this system. There are four functions in this system, including flights querying, user register, flight ordering, and orders checking.    

User should follow some specific commands to use this system because only command line is developed in this system; also someone other should develop their own Graphic User Interface (GUI) by some other programming languages or tools.  In this system, the core function is how to design a distributed system based on Java Socket, rather than the GUI.

####Packet organization:
For the purpose of a good project structure, the project will be organized with different packets, which will be helpful to modified and expanded.  In this project, the packet organization in server-side is developed into five main parts; in consist of common, dao (dao.impl), entity, server, and util. Each packet used to organize different Java classes. Figure 2 shows the packets in server-side (including proxy server, and airline server). It is similar in client-side.

![packet organization](/images/blog/packet.png)
Figure 1: Packet organization in server-side

- Packet **Common** used to store the public interface, constants, and HOPP of server-side.
- Packet **Dao** used to store the database access classes including database read and write methods. It’s child packet Impl used to store their interface implemented classes.
- Packet **Entity** used to store the entity classes in response to the tables in database.
- Packet **Server** used to store the server class including the main function.
- Packet **Util** used to store the utility classes and property file.

####Proxy desgin：
The proxy server is the core part of this flight booking system, because all clients should communicate with the airline servers via the proxy server, that is to say, the proxy server handle the messages passing from clients and distribute them to different airline servers. To separate this two different business logics, two HOPP are implemented in this part, the PSHOPP used to handle the requests and response, PCHOPP used to handle the requests processed by PSHOPP and distributed them to the airline servers.

####Conclusion:
In conclusion, a distributed flight booking system is developed in this assignment, users could use some commands that specified by the system to use this system. Four main functions are developed in this system, including flight querying, user registering, flight booking, and orders checking.    

For the purpose of implementing the techniques that taught in class to improve the system, design patterns such as MVC, DAO, and HOPP are used in this system, and text protocols used to afford interfaces for someone else to expanding this system. Further, this flight booking system is capable of handling three airline servers concurrently. Therefore, this flight booking system could meet all the specifications. 