---
layout: post
title: 基于Java的CORBA编程入门
category: knowledge
---
####Abstract:
Common Object Request Broker Architecture (CORBA), which allows objects written in a variety of programming languages to be accessed by client programs which themselves may be written in a variety of programming languages. Corba is a product of OMG (Object Management Group).

<!--more-->
####Basics:
CORBA is not a specific implementtation, but a specification for creating and using distributed objects. Java IDL (Interface Definition Language) is the ORB that constitutes one of the core packages of the Java SE.

RMI ORBs use a protocol called JRMP (Java Remote Method Protocol), CORBA ORBs use IIOP (Internet Inter-Orb Protocol), which is based on TCP/IP. It is IIOP that provides interoperability between ORBs from different vendors. CORBA use IDL to define the interfaces for its objects.

####The Java IDL Process:
**1.Create the IDL file.**
Hello.idl
    
    module SimpleCORBAExample{
        interface Hello{
            string getGreeting();
        };//donot forget semi-colon
    };//it seems like c++, terminated with a semi-colon

**2.Compile the IDL file.**
Using the following command to comile the IDL file.

    idlj -fall Hello.idl
    
The parameter **-f** should be followed with **client, server, and all**. **all** means the client and server are to be run on the same machine.

**3.Implement the interface(server-side)**
    
    class HelloServant extends HelloPOA{
        //implement the interface
    }
    
**4.Create the server**

    // init ORB
    ORB orb = ORB.init( args, null );

	// init POA
	POA poa = POAHelper.narrow(orb.resolve_initial_references("RootPOA"));
	poa.the_POAManager().activate();

    // create a Hello object
    HelloImpl impl = HelloImpl();	
    
   //get object reference from the servant
	org.omg.CORBA.Object ref = rootpoa.servant_to_reference(impl);
	FlightBooking href = FlightBookingHelper.narrow(ref);
			
	org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
	NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

    String name = "hello";
	NameComponent path[] = ncRef.to_name(name);
	ncRef.rebind(path, href);
			
	System.out.println("Server ready and waiting...");
	//startup the thread, waiting for the call from client
	orb.run();
	
**5.Create a client**

    ORB orb = ORB.init(args, null);
	// get the root naming context
	org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
	NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

	// resolve the Object Reference in Naming
	String name = "Hello";
    impl = FlightBookingHelper.narrow(ncRef.resolve_str(name));

	System.out.println("Obtained a handle on server object: " + impl);
	
**6.Compile and run**
Start the CORBA naming service firstly (in CMD):

    tnameserv
    //or specify any port number
    tnameserv -ORBInitialPort 1234
    
Start the server in a new command window
    
    java HelloServer
    //or specify any port number
    java HelloServer -ORBInitialPort 1234

Start the client in a third command window
    
    java HelloClient
    //or specify any port number
    java HelloClient -ORBInitialPort 1234
