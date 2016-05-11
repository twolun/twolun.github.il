---
layout: post
title: 使用Fetch API和ES6生成器来构建异步API
category: technique
---

[ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/)为JavaScript带来了大量的新特性，
它让JavaScript能够更好的构建大型应用。在这些特性中，[promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)
和[生成器（Generator）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2a)为开发者进行异步编程带来了极大便利。
另一项对开发者有用的新技术是浏览器新增的[Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API)，它致力于取代作为当前远程资源通信基础的`XMLHttpRequest`。
本文将介绍了是如何结合Fetch API和生成器来构建异步API。

<!--more-->

## Statement

- **原文地址：** http://www.sitepoint.com/asynchronous-apis-using-fetch-api-es6-generators/
- **译者：**[景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。

## Fetch API

Fetch API的方法返回的是ES6 `Promise`对象，可以与生成器相结合共同完成复杂的异步操作。并且在这种方式下，异步操作的方法可以链接起来，
连接后的每一个操作取决于前一次操作中返回的值。对于异步操作而言，你需要重复的向服务器发起请求以获得最近的更新。

[Chrome, Opera, Firefox和Android浏览器](http://caniuse.com/#search=Fetch)的最新版本都支持Fetch API。
对于不支持的浏览器，你可以借助于[fetch-polyfill](https://github.com/github/fetch)来提供辅助实现。
另外，为了便于你阅读与学习，本文中的代码可以查看[这个Github仓库](https://github.com/sitepoint-editors/FetchAPI-Generators)。

## 在异步操作中使用生成器

如果你对生成器还不了解，可以参考下面几篇文章：

- [ECMAScript 2015: Generators and Iterators](http://www.sitepoint.com/ecmascript-2015-generators-and-iterators/)
- [Koa入门：生成器](http://www.csdn.net/article/2015-09-15/2825710-koa)

我们如何使用生成器来执行异步操作呢？如果我们分析生成器的工作方式的话，很快就能得到答案。

生成器函数其实是基于迭代器实现的，并且有如下的结构：


```javascript
function *myIterator() {
    while(condition) {
        yield value;	
    }	
}
```

`yield`关键字负责返回结果，它会暂停迭代器函数的执行直到它被再一次的调用。它也会记住函数的状态，
而不是在下次执行的时候重新运行一切，它能够有效的记住上一次暂停的地方。

因此，对于上述代码你可以不使用循环语句来实现，如下：

```javascript
function *myIterator(){
    //calculate value 1
    yield value1;
    
    //calculate value 2
    yield value2;
    ...
    
    //calculate value n
    yield valuen;
}
```
	
这两种写法下，函数的行为其实是等同的。使用`yield`关键字唯一原因是它可以在下一次迭代前暂停函数的执行
（在内部它是异步操作）。并且`yield`语句可以返回任何值，你可以通过它返回`Promise`，或者让函数运行多重异步调用。

## 在Fetch API中使用生成器

如果你对Fetch API不是很了解的话，你可以参考[这篇文章](http://www.sitepoint.com/introduction-to-the-fetch-api/)。

正如前面所说的，Fetch API被设计用来取代传统的`XMLHttpRequest`。这个新的API能够提供对HTTP请求完整的控制权，
并且返回的是一个`Promise`对象，基于服务端返回的响应决定是resolve还是reject。

### 长轮询

将Fetch API和生成器组合起来使用的一个场景是[长轮询](http://www.pubnub.com/blog/http-long-polling/)。
长轮询是一种通过客户端不断发送请求给服务器直到获得响应的技术。生成器可以用于这样的场景来不断的yielding响应直到响应包含数据。
长轮询的过程如下图所示。

![Long Polling](http://7xpv9g.com1.z0.glb.clouddn.com/img151028-long-polling.PNG)

为了来模拟长轮询的过程，下面会首先实现一个简单的Express REST API用于响应请求，
每5次请求会返回一次城市的天气信息。REST API设计如下：

```javascript
var polls=0;

app.get('/api/currentWeather', function(request, response){
    console.log(polls, polls<5);
    if(polls < 5){
        console.log("sending...empty");
        polls++;
        response.send({});
    }
    else{
        console.log("sending...object");
        response.send({
            temperature: 25,
            sky: "Partly cloudy",
            humid: true
        });
        polls = 0;
    } 
});
```
	
现在让我们编写生成器函数来不断的调用这个API，每次迭代会返回一个`Promise`对象。
对客户端而言，我们并不知道需要多少次迭代才能从服务器获得到数据。因此，
下面的方法使用的是无穷循环来不断的ping服务器。代码如下：

```javascript
	function *pollForWeatherInfo() {
		while(true) {
			yield fetch('/api/currentWeather', {
				method: 'get'	
			}).then(d => d.json());	
		}	
	}
```	
    
我们需要一个函数来不断的调用这个函数，并且检查每次返回的Promise是否存在天气信息。
可以使用一个在下一次迭代时调用的递归函数来实现，并且只在发现了从服务器返回的值的时候才暂停这一过程。
下面的代码展示了上述过程的实现：

```javascript
function runPolling(generator){
    if(!generator){
        generator = pollForWeatherInfo();
    }
    
    var p = generator.next();
    p.value.then(function(d){
        if(!d.temperature){
            runPolling(generator);
        } else {
            console.log(d);
        }
    });
}

runPolling();
```

正如代码所述，第一次调用`runPolling()`会创建生成器对象。`next()`方法会返回一个包括`value`属性的对象，
在这里，`value`包括的值是来自于`fetch()`方法返回的`Promise`对象。当promise被通过时，
它要么包括一个空对象（当`polls`值小于5时返回），要么包括对应的天气信息。

下一步，我们需要检查对象的`temperature`属性，如果这个值不存在，我们将`generator`对象传递回下一个函数调用
（这样可以避免丢失生成器的状态），或者将对象的值打印在控制台中。

你可以从[仓库](https://github.com/sitepoint-editors/FetchAPI-Generators)中下载代码，
安装相应的的依赖，启动服务器，然后浏览器`http://localhost:8000`。你应该会从控制台看到如下的结果：

```
0 true
sending...empty
1 true
sending...empty
2 true
sending...empty
3 true
sending...empty
4 true
sending...empty
5 false
sending...object
```

### 多重依赖的异步调用

很多情况下，我们需要解决的是多重依赖的异步调用，也就是锁，每个后继的异步操作取决于前一个异步操作返回的值。
如果我们有一组这样的操作，并且它们需要被调用多次，我们可以将它们一起放到生成器函数中，在需要的时候执行它。

为了进一步说明这一点，我将会调用[Github API](https://developer.github.com/v3/)。
借助这个API我们能够获取用户、组织、或仓库的基本信息。通过这个API我们还能够获取一个仓库或组织的贡献者，
然后我们将获取的数据显示在屏幕上。

基于此，我们需要调用三个不同的端点。需要执行的任务如下：

- 获得某个组织的详细信息
- 如果组织存在的话，获得组织所拥有的仓库
- 获得组织中某个仓库（随机选择）涉及的贡献者

下面我们来创建一个函数包裹Fetch API，这样可以避免重复的创建请求头和构建请求对象：

```javascript
function wrapperOnFetch(url){
    var headers = new Headers();
    headers.append('Accept', 'application/vnd.github.v3+json');
    var request = new Request(url, {headers: headers});
    
    return fetch(request).then(function(res){
        return res.json();
    });
}
```

下面的函数会调用上面的函数，每次调用都会yields一个`Promise`对象：

```javascript
function* gitHubDetails(orgName) {
    var baseUrl = "https://api.github.com/orgs/";
    var url = baseUrl + orgName;
    
    var reposUrl = yield wrapperOnFetch(url);
    var repoFullName = yield wrapperOnFetch(reposUrl);
    yield wrapperOnFetch(`https://api.github.com/repos/${repoFullName}/contributors`);
}
```
    
现在，让我们来写一段代码逻辑用来调用上面的函数，进而获取生成器，
然后使用从服务器返回的值传递到UI层中。因为每次调用生成器的`next`方法会返回`promise`，
我们将会把这些`promise`链接起来。下面的代码展示了一个简单的骨架，在代码中使用了上面函数返回的生成器：

```javascript
var generator = gitHubDetails("aspnet");

generator.next().value.then(function (userData) {
    //Update UI
    
    return generator.next(userData.repos_url).value.then(function (reposData) {
        return reposData;
    });
    }).then(function (reposData) {
    //Update UI
    
    return generator.next(reposData[randomIndex].full_name).value.then(function (selectedRepoCommits) {
        //Update UI
    });
});
```

上面只是一个代码骨架，详细的代码你可以参考[这个仓库](https://github.com/wwsun/awesome-javascript/tree/master/examples/fetch-demo)，
你需要通过npm安装相应的依赖，并将代码放在服务器中。

## 总结

本文详细介绍了如何在Fetch API结合生成器函数来构建异步API。ECMAScript 6为JavaScript开发者带来了大量新的特性，
可以帮助开发者编写更优雅、更健壮的代码，难道你不应该拥抱ES6，在你的项目中尝试使用ES6的这些新特性吗？
赶紧开始尝试这些新技术吧。