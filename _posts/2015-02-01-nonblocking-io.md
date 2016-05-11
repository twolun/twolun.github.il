---
layout: post
title: Node的异步和非阻塞I/O
category: technique
---

Node为服务器端JavaScript提供了一个事件驱动的、异步的平台。在Node中，I/O几乎总是在主事件轮询之外进行，使得服务器可以一直处于高效并且随时间能够做出响应的状态，就像NGINX一样。本文将介绍Node中的非阻塞I/O和异步编程技术。

<!--more-->

###阻塞I/O
我们用一个例子来说明非阻塞I/O：设想一家咖啡店，例如星巴克，我们可以将每一个顾客看成是一个任务，而将咖啡店的工作人员看成是服务器端应用，例如服务器端有三类应用：收银员、咖啡师、服务员，分别负责收钱、调制咖啡和派送咖啡。

在这之前，我们看看传统的服务器端是如何工作的：顾客A选择咖啡、收银员收费、咖啡师调制、调制好后服务员将咖啡拿给顾客A。后面的顾客B，C，D会被前面为完成这一系列手续的顾客A所阻塞。试想，如果顾客A选择了一个工序非常复杂的咖啡，那么整个队伍都将被阻塞，后面的顾客只能等待，这样显得非常的低效。

为了改进这种状况，咖啡店就必须增加更多的收银员、更多的咖啡师、更多的服务员，这就使得单线程变为多线程，形成了并行。事实上，这是除了Node以外的所有服务器端技术真实的工作方式。

###非阻塞I/O
让我们来看一下非阻塞I/O的例子，这也是现实生活中咖啡店的工作方式：顾客A点单，收银员收费后将任务传达给咖啡师，顾客A在等待的同时，顾客B,C也可以进行点单，并不需要等待A完成取咖啡动作后才能点单、付费。这样，所有的任务可以异步的进行，而不需要因为一个顾客而将整个队伍阻塞。

我们来看看异步编程的一个例子：

###异步编程

		var test = function(callback) {
		    return callback();
		    console.log('test');
		};
		
		var test2 = function(callback) {
		    callback();
		    console.log('test2'); //3
		};
		
		test(function(){
		    console.log('callback1'); //1
		    test2(function(){
		        console.log('callback2'); //2
		    })
		});

可以使用`node app.js`来执行这段程序。这段程序的输出下所示：

	callback1
	callback2
	test2

如果我们在程序中增加一个setTimeout的话，我们可以真实的看到异步编程的功效：

		var test = function(callback) {
		    return callback();
		    console.log('test');
		};
		
		var test2 = function(callback) {
		    callback();
		    console.log('test2'); //2
		};
		
		test(function(){
		    console.log('callback1'); //1
		    test2(function(){
		        setTimeout(function(){
		            console.log('callback2') //3
		        }, 100);
		    })
		});

这样程序的输出变为：
	
	callback1
	test2
	callback2

输出的变化，说明了函数test2中的callback()和console.log('test2')是彼此独立执行的，彼此间并没有相互的前后依赖关系，而这也是与传统的服务器端编程技术最大的差异。

用咖啡店的例子来解释这一点：顾客A虽然首先点了咖啡，但排在后面的咖啡B可能比A先拿到咖啡，因为A点的咖啡的工序可能比B的耗时。而在现实生活中，无论在餐馆吃饭还是购买咖啡，都会出现这种情况。

更多的例子，你可以参考文章[[2]](https://cnodejs.org/topic/4f50dd9798766f5a610b808a)

###知识拓展

1. 事件轮询：http://en.wikipedia.org/wiki/Event_loop
2. 异步I/O： http://en.wikipedia.org/wiki/Asynchronous_I/O
3. [JavaScript Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/EventLoop)

###References

1. Rapid Prototyping with JavaScript, chapter 8
2. https://cnodejs.org/topic/4f50dd9798766f5a610b808a
3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/EventLoop