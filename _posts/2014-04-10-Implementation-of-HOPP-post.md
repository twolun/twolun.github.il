---
layout: post
title: Simple Introduction to HOPP Design Pattern
category: knowledge
---
Sometimes objects must appear in more than one computing context (that is, address space.) How can we make difference one and multiple address spaces (for example, single versus distributed processing) transparent? This post will introduced a FTP program which using the design pattern named HOPP (Half Object Plus Protocol).    

<!--more-->
####solution:
Divide the object into two interdependent half-objects, one in each address space, with a protocol between them. In each address space, implement whatever functionality is required to interact efficiently with the other objects in that address space. This may result in duplicated functionality.    

The HOPP pattern deals with the placement and replication of objects in a distributed computing environment. However, how can we use the HOPP design pattern in the design of a distributed system.

####Client-side HOPP
From my respect of view, the HOPP in client-side should be used to extract the business logic that could sperate the control flow and communication logic, that is to say, the client could only care about the results they needed, rather than the detail of the communication between client and server.   

Based on this solution, we can extract the the communication logic as a HOPP class. For instance, if we design a FTP program based on Socket, the HOPP in client side should be implemented as the following format:

    ClientHOPP{
        //constructor with one argument
        public ClientHOPP(String server){
            //socket init
            //create the tcp socket in client-side
            //getReader
            //getWriter
        }
        
        //business logic as follows:
        public String[] dir(){
            writer.print(DIR+CR_LF);
            while(true){
                line = reader.readLine();
                if(line.equals(""))break;
                list.add(line);
            }
            return list.toArray(listStr);//list-->string
        }
        
        //ignore others
        //....
    }

As we can see from the above codes, all the communication detail should be implemented in the client-side HOPP, the client only care about the results that it wanted. We can implement the client easily.

    class Client{
        Client(String server){
            clientHopp = new ClientHOPP(server);
        }
        
        main(){
            //business loop
            //afford a ui to get requests from users
            if(DIR)
                dir();
            else(...)
                ....;
        }
        
        dir(){
            String[] dir = clientHOPP.dir();
            //foreach
            //syso, print out the results
        }
        
        //ignore others
    
    }
    
For good purpose of designing the client, using HOPP is easy and helpful for developers to modify old codes or add new functions. Actually, it is similar to implement HOPP in the server-side. But for a Socket program, HOPP could me used to separate the business logic without the process of communication.

####Server-side HOPP
A basic c/s program could be implemented as the follows:
    
    class Server{
        server = new ServerSocket(PORT);
        while(true){
            incoming = server.accept();
            new SocketHandler(incoming).start();
        }
    }

Here we use a socket handler to handle the specific requests from client.

    class SocketHandler extends Thread{
        run(){
            if(DIR)
                dir();
            else if(..)
                ...;
        }
        
        public void dir(){
            String[] fileNames = serverHopp.dir();
            writer.print(RESULT+CR_LF);
        }
    }
    
And we can implement all the specific requests in server-side HOPP class. For a distributed system, using HOPP will be helpful for designer to seperate differnt communicaiton logic. The following figure shows the HOPP design in a simple distributed system.

![HOPP in a simple distributed system](/images/blog/hopp.png)