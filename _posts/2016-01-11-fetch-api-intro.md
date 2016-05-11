---
layout: post
title: 深入浅出Fetch API
category: technique
---

多年来，`XMLHttpRequest`一直是web开发者的亲密助手。无论是直接的，还是间接的，
当我们谈及Ajax技术的时候，通常意思就是基于`XMLHttpRequest`的Ajax，它是一种能够有效改进页面通信的技术。
Ajax的兴起是由于Google的Gmail所带动的，随后被广泛的应用到众多的Web产品（应用）中，可以认为，
开发者已经默认将`XMLHttpRequest`作为了当前Web应用与远程资源进行通信的基础。
而本文将要介绍的内容则是`XMLHttpRequest`的最新替代技术——[Fetch API](https://fetch.spec.whatwg.org/)，
它是W3C的正式标准，本文将会介绍Fetch API的相关知识，以及探讨它所能使用的场景和能解决的问题。

<!--more-->

## Statement

> 原文地址： http://www.sitepoint.com/introduction-to-the-fetch-api/

**译者：**景庄，Web开发工程师，主要关注于前端工程化技术、Node.js、React等。

## Fetch API

Fetch API提供了一个`fetch()`方法，它被定义在BOM的`window`对象中，你可以用它来发起对远程资源的请求。
该方法返回的是一个Promise对象，让你能够对请求的返回结果进行检索。

为了能够进一步的解释Fetch API，下面我们写一些代码来具体的介绍它的用法：
下面这个例子将会通过Flicker API来检索一些图片，并将结果插入到页面中。到目前为止，
Fetch API还未被所有的浏览器支持。因此，如果你想体验这一技术，最好使用最新版本的Chrome浏览器。
为了能够正确的调用Flicker API，你需要申请自己的API KEY，将其插入到代码中的适当位置，即`your_api_key`那个位置。

来看看第一个任务：我们使用API来从Flicker中检索一些有关”企鹅“的照片，并将它们展示在也没中，代码如下。

```javascript
/* API URL, you need to supply your API key */
var URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=your_api_key&format=json&nojsoncallback=1&tags=penguins';

function fetchDemo() {
    fetch(URL).then(function(response) {
        return response.json();
    }).then(function(json) {
        insertPhotos(json);
    });
}

fetchDemo();
```
   
上面的代码看起来很简单：首先是构造请求的URL，然后将URL传递给全局的`fetch()`方法，它会立刻返回一个Promise，
当Promise被通过，它会返回一个`Response`对象，通过该对象的`json()`方法可以将结果作为JSON对象返回。
`response.json()`同样会返回一个`Promise`对象，因此在我们的例子中可以继续链接一个`then()`方法。

为了能够和传统的`XMLHttpRequest`进行对比，我们使用传统的方法来编写一个同样功能的函数：

```javascript
function xhrDemo() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        insertPhotos(JSON.parse(xhr.responseText));
    };
    xhr.open('GET', URL);
    xhr.send();
}
```

可以发现，主要的不同点在于：传统上我们会使用事件处理器，而不是Promise对象。
并且请求的发起完全依赖于`xhr`对象所提供的方法。

到目前为止，相比传统的`XMLHttpRequest`对象，我们使用Fetch API获得了更简洁的编码体验。但Fetch API不止于此，
下面我们进一步的深入下去。

## 为什么需要替代`XMLHttpRequest`

看了前面的例子，你可能会问，为什么不直接使用那些[现有的`XMLHttpRequest`包装器](http://www.sitepoint.com/comparison-javascript-http-libraries/)呢？
原因在于Fetch API不仅仅为你提供了一个`fetch()`方法。

对于传统的`XMLHttpRequest`而言，你必须使用它的一个实例来执行请求和检索返回的响应。
但是通过Fetch API，我们还能够明确的配置请求对象。

你可以通过`Request`构造器函数创建一个新的请求对象，这也是建议标准的一部分。
第一个参数是请求的URL，第二个参数是一个选项对象，用于配置请求。请求对象一旦创建了，
你便可以将所创建的对象传递给`fetch()`方法，用于替代默认的URL字符串。示例代码如下：

```javascript
var req = new Request(URL, {method: 'GET', cache: 'reload'});
fetch(req).then(function(response) {
  return response.json();
}).then(function(json) {
  insertPhotos(json);
});
```
	
上面的代码中我们指明了请求使用的方法为`GET`，并且指定不缓存响应的结果。

有关`Request`对象的另一件更酷的事在于，你还可以基于原有的对象创建一个新的对象。
新的请求和旧的并没有什么不同，但你可以通过稍微调整配置对象，将其用于不同的场景。
例如，你可以基于原有的GET请求创建一个POST请求，它们具有相同的请求源。代码如下：

```javascript
  // 基于req对象创建新的postReq对象
  var postReq = new Request(req, {method: 'POST'});
```
    
每个`Request`对象都有一个`header`属性，在Fetch API中它对应了一个`Headers`对象。
通过`Headers`对象，你能够修改请求头。不仅如此，对于返回的响应，你还能轻松的返回响应头中的各个属性。
但是需要注意的是，响应头是只读的。

```javascript
var headers = new Headers();
headers.append('Accept', 'application/json');
var request = new Request(URL, {headers: headers});

fetch(request).then(function(response) {
    console.log(response.headers);
});
```
	
在上面的代码中，你可以通过`Headers`构造器来获取这个对象，用于为新的`Request`对象配置请求头。

相似的，你可以创建一个`Response`对象：

```javascript
function responseDemo() {
    var headers = new Headers({
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600'
    });
    
    var response = new Response(
        JSON.stringify({photos: {photo: []}}),
            {status: 200, headers: headers}
    );
    response.json().then(function(json) {
        insertPhotos(json);
    });
}
```
	
`Request`和`Response`都完全遵循HTTP标准。如果你曾经使用过某种服务器端语言，你应该对它们很熟悉。
但是对于浏览器而言创建HTTP响应的要点是什么？总之，你不能将它发送给其他人。但是，
你可以通过[Service Worker API](http://www.w3.org/TR/service-workers/)将响应发送给你自己。
Service Worker允许通过截取来自浏览器的请求头和提供本地构造的响应头来替换来自服务器的响应头的方式来构建离线应用。
你需要注意的是，在本文写作的时候Service Worker仍然是实验性的，并且仍处在不断变化之中。

## Fetch API面临的阻力

Fetch API从提出到实现一直存在着争议，由于一直现存的历史原因（例如HTML5的拖拽API被认为太过稀疏平常，Web Components标准被指意义不大）。
因此重新设计一个新的API来替代久经沙场历练的`XMLHttpRequest`就变得阻力重重。

其中一种反对观点认为，Promises缺少了一些重要的`XMLHttpRequest`的使用场景。例如，
使用标准的ES6 Promise你无法收集进入信息或中断请求。而Fetch的狂热开发者更是试图提供[Promise API的扩展](https://github.com/whatwg/fetch/issues/27)用于取消一个Promise。
这个提议有点自挖墙角的意思，因为将这将让Promise变得不符合标准。但这个提议或许会导致未来出现一个可取消的Promise标准。
但另一方面，使用`XMLHttpRequest`你可以模拟进度（监听`progress`事件），也可以取消请求（使用`abort()`方法）。
但是，如果有必要你也可以使用Promise来包裹它。

另一种反对观点认为，Web平台需要的是更多底层的API，而不是高层的API。对此的回答恰恰是，
Fetch API足够底层，因为[当前的WHATWG标准定义了`XMLHttpRequest.send()`方法](https://xhr.spec.whatwg.org/#the-send%28%29-method)其实等同于fetch的`Requset`对象。
Fetch中的`Response.body`实现了`getReader()`方法用于渐增的读取原始字节流。
例如，如果照片列表过大而放不进内存的话，你可以使用下面的方法来处理：

```javascript
function streamingDemo() {
    var req = new Request(URL, {method: 'GET', cache: 'reload'});
    fetch(req).then(function(response) {
        var reader = response.body.getReader();
        return reader.read();
    }).then(function(result, done) {
        if (!done) {
        // do something with each chunk
        }
    });
}
```

在上面的代码中处理器函数一块一块的接收响应体，而不是一次性的。当数据全部被读完后会将`done`标记设置为true。
在这种方式下，每次你只需要处理一个chunk，而不是一次性的处理整个响应体。

不幸的是，对于[Stream API](https://streams.spec.whatwg.org/)而言，这仍然还处于早期阶段，这种方式下，如果你需要解析JSON，
你仍然需要从头实现很多的工作。

## 浏览器支持

![Fetch Support](http://7xpv9g.com1.z0.glb.clouddn.com/img151015-fetch-support.PNG) 

[Fetch API](http://caniuse.com/#search=Fetch)

目前Chrome 42+, Opera 29+, 和Firefox 39+都支持Fetch。微软也[考虑](https://status.modern.ie/fetchapi)在未来的版本中支持Fetch。
讽刺的是，当IE浏览器终于微响应实现了progress事件的时候，`XMLHttpRequest`也走到了尽头。
目前，如果你需要支持IE的话，你需要使用一个[polyfill](https://github.com/github/fetch)库。

## 总结

在本文中我们为你介绍了Fetch API的整体概况以及它所能解决的问题。在表层，
这个API看起来非常的简单，但它同时也与一些底层的API相关联，例如Streams，
这让客户端编程有点类似于系统编程。

此外，本文中的代码示例你可以参考这个[仓库](https://github.com/sitepoint-editors/fetch-demo)。

## References

1. [传统Ajax已死，Fetch永生](https://github.com/camsong/blog/issues/2)
1. [That's so Fetch!](http://jakearchibald.com/2015/thats-so-fetch/)
1. [Ain't that fetch!](http://webreflection.blogspot.co.uk/2015/03/aint-that-fetch.html)
1. [Fetch API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)