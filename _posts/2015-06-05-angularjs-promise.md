---
layout: post
title: 理解AngularJS中的Promise
category: technique
---

在AngularJS中，通过内置的`$q`服务来提供Promise API。Promise是用来表示异步操作返回的一个对象，该对象是用来获取未来的执行结果的一个代理，初始值并不确定。Promise目前已经存在于ECMAScript 6的规范定义中。

<!--more-->

## 小故事

上面的套话可能吓坏了大家，下面通过一个简单的例子来说明到底什么是Promise：

### 一天，小明的爸爸和小明说“儿子，去看看今天的天气怎么样”。

每个周日的早上，小明的爸爸都会让小明去查看一下天气预报，因为没有网络的缘故，小明只能通过使用一个特别长的望远镜站在他家附近最高的上坡上去观察天气状况。小明像爸爸保证（Promise）会去获取第二天的天气预报。于是小明与小明爸爸在小明离开家时间建立了一个Promise。

与此同时，小明爸爸决定如果明天天气好就去钓鱼，如果不好就待在家，但是他只有等待小明带回来天气预报后才能做出最后的决定。

30分钟后，小明回来了，爸爸根据小明带回来的天气预报做出第二天的行程决定。这样的事情，每周都在循环往复。

### 结果A：收到天气预报！天气晴朗！

小明成功获取了天气预报，第二天的天气为晴朗！Promise达成（promise was fulfilled），因此小明爸爸准备第二天去钓鱼。

### 结果B：收到天气预报！有雨！

小明成功获取了天气预报，第二天气为有雨！Promise达成，因此小明爸爸准备第二天待在家里。

### 结果C：无法得到天气预报！

小明没有能够获取天气预报，因为今天扬起了沙尘暴，小明没办法使用望远镜观察天气状况，因此无法进行预测。于是Promise未能达成（promise was rejected），于是小明爸爸准备第二天待在家里，因为它无法知道第二天的天气，于是选择了保守的做法。

## 回到代码

在上面的例子中，小明爸爸控制了整个业务逻辑，他的决策取决于小明带回来什么样的信息，因此可以将小明看成一个服务。

我们重新整理一下上面的故事：小明爸爸让小明去获取天气预报，而小明不能立刻得到答案，而是需要花时间上山观察天气状况，小明爸爸可以在小明去获取天气预报的过程中做其他事情，小明和他爸爸之间建立了一个获取天气预报的承诺（promise)。当小明爸爸得到天气预报时，他可以做出选择，要么第二天去钓鱼，要么第二天待在家。

这里最重要的一点是：小明去观察天气这件事不应该阻塞父亲去做其他事，因此，这就是为什么这种情况非常适合创建promise，因为结果可以在稍后在做出（fullfilled or rejected）。

在AngularJS中，我们使用`then()`函数来指定父亲在小明获取天气预报后可以做出的选择。`then()`函数接收两个函数作为参数：一个函数用于promise达成时进行执行，另一个函数用于promise被拒绝时进行执行。

### 控制器：FatherCtrl

	// function somewhere in father-controller.js
    var makePromiseWithSon = function() {
        // This service's function returns a promise, but we'll deal with that shortly
        SonService.getWeather()
            // then() called when son gets back
            .then(function(data) {
                // promise fulfilled
                if (data.forecast==='good') {
                    prepareFishingTrip();
                } else {
                    prepareSundayRoastDinner();
                }
            }, function(error) {
                // promise rejected, could log the error with: console.log('error', error);
                prepareSundayRoastDinner();
            });
    };
    
### 服务：SonService

我们可以将小明看成一个服务，而获取天气预报的过程可以看成是去请求天气预报API的过程，我们可以用`$http`进行天气预报API的调用，这是一个异步任务，它将得到一个动态的结果，成功、失败、或是网络错误等。

    app.factory('SonService', function ($http, $q) {
        return {
            getWeather: function() {
                // the $http API is based on the deferred/promise APIs exposed by the $q service
                // so it returns a promise for us by default
                return $http.get('http://fishing-weather-api.com/sunday/afternoon')
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
            }
        };
    });

最为核心的是：父亲在等待小明获取天气预报的过程中不需要被阻塞，而是可以做其他事情。

## 深入Promise

与Promise的作用类似的是回调函数，但回调函数的使用再复杂环境下会导致多层的嵌套（Callback Hell）。因此，使用Promise来处理异步任务显得更为优雅，Promise的核心是它的`then()`方法，我们可以使用这个方法从一部操作中获得返回值、或异常。

### Promise的基本规则

1. 每个异步任务都将返回一个Promise对象
2. 每个Promsie对象都有一个`then()`函数，它接收两个参数：成功时的处理函数，失败时的处理函数
3. 当每次异步任务完成时，成功或失败的处理函数有且只有一个被执行，且只执行一次
4. `then()`函数也可以返回一个Promise对象，这使得允许嵌套调用`then()`
5. 成功或失败的处理函数可以返回一个值，这个值可以传给`then()`函数链的下一层
6. 如果处理函数返回了一个Promise（执行一个新的异步任务），那么函数链的下一个函数后需要等待该异步任务完成后才能被调用。

看一个例子：用传统的回调函数处理异步任务，代码可能是这样的：

	// Fetch some server configuration
	xhrGET('/api/server-config', function(config) {
		// Fetch the user information, if he's logged in
		xhrGET('/api/' + config.USER_END_POINT, function(user) {
			// Fetch the items for the user
			xhrGET('/api/' + user.id + '/items', function(items) {
				// Actually display the items here
			});
		});
	});

现在使用Promise API改写上面的回调代码，可以得到如下代码：

	$http.get('/api/server-config').then(function(configResponse) {
		return $http.get('/api/' + configResponse.data.USER_END_POINT);
	}).then(function(userResponse) {
		return $http.get('/api/' + userResponse.data.id + '/items');
	}).then(function(itemResponse) {
		// Display items here
	}, function(error) {
		// Common error handling
	});

代码变得清晰多了！

### AngularJS中的`$q`服务

`$q`服务在AngularJS中用于帮你实现函数的异步执行。它的API如下：

#### `$q.defer()`

当我们需要为我们的异步任务创建Promise时，可以用`$q.defer()`创建一个deferred（延迟）对象。

#### deferredObject.resolve

向promise对象的异步函数发送消息告诉他我已经成功完成任务，value即为发送的消息。

#### deferredObject.reject

向promise对象的异步函数发送消息告诉他我已经不可能完成这个任务了，value即为发送的消息。

#### `$q.reject`

参数接收错误消息，相当于在回调函数中抛出一个异常，然后在下一个then中调用错误的回调函数。

## References

1. 官方文档 https://docs.angularjs.org/api/ng/service/$q
2. 例子来源 http://andyshora.com/promises-angularjs-explained-as-cartoon.html
3. https://thinkster.io/a-better-way-to-learn-angularjs/promises
4. AngularJS: Up and Running