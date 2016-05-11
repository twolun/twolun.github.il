---
layout: post
title: JavaScript Promise API
category: knowledge
---

Promise是抽象异步处理对象以及对其进行各种操作的组件。
本文将会详细的向你介绍如何在JavaScript中借助Promise来简化异步代码流。

<!--more-->

## Statement

- **作者：** [景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。
- 本文是[JavaScript Promise - there and back again](http://www.html5rocks.com/en/tutorials/es6/promises/)改动版

## 背景知识

JavaScript是单线程的，这意味着代码是按顺序执行的。对于浏览器而言，JavaScript代码和其他任务共享一个线程，
不同的浏览器略有差异，但大体上这些和JavaScript共享线程的任务主要包括重绘、更新样式、用户交互等，
所有这些任务操作都会阻塞其他任务。

避免事件阻塞的常用方法是使用事件监听器。我们可以为某些特定事件设置监听器，如果事件发生的话，便立刻触发监听器，
你应该已经习惯使用回调函数来解决这个问题了，例如：

```javascript
var img1 = document.querySelector('.img-1');
img1.addEventListener('load', function() {
  // 图片加载完成
});

img1.addEventListener('error', function() {
  // 出问题了
});
```

上面的代码中，我们添加了两个监听器，请求图片，回调函数只在事件发生的时候才会被触发。但是通过事件机制还存在几个问题：

1. 事件在绑定之前就发生了怎么办？
2. 在添加监听器之前，图片加载发生了错误怎么办？

仅仅是一张图片就存在这么多问题，那么如果有一堆图片要处理，又该怎么办？下面我们就谈谈Promise，一个越来越流行的异步解决方案。

## Promise

JavaScript的一大特点就是会涉及到大量的异步代码。同步代码通常易于理解和调试，而异步代码则具有更好的性能和灵活性。
目前Promise正逐渐称为JavaScript世界的一个重要组成部分，并且很多新的API也都基于Promise进行了实现。
目前已经有一些原生API使用了Promise，包括：

- [Battery API](https://davidwalsh.name/javascript-battery-api)
- [Fetch API](https://davidwalsh.name/fetch)
- ServiceWorker API

### 什么是Promise

那么到底什么是Promise呢？`Promise`是ES6规范新增的对象，它可以用于延迟计算和异步计算。
一个`Promise`对象代表着一个还未完成，但预期会完成的操作。需要记住：

- 一个Promise要么成功要么失败，并且状态不可变
- 可以根据Promise的结果设置特定的回调函数

### Promise的状态

一个Promise的状态可以是：

- **等待 pending** - Promise的初始化状态，等待结果
- **完成 fullfilled** - 该Promise对应的异步操作成功完成了
- **失败 rejected** - 该Promise对应的异步操作失败了
- **结束 settled** - 任务完成或失败了

### 基本使用

`new Promise()`构造器应该只被用于传统的异步任务上，例如`setTimeout`或`XMLHttpRequest`。
通过`new`关键字创建一个新的`Promise`，它接收一个回调函数作为参数，该回调函数又包括了两个特定的回调函数，
分别被命名为`resolve`和`reject`，成功后调用`resolve`，失败则调用`reject`。

根据不同的任务，由开发者来决定`resolve`和`reject`在函数体内的位置。

```javascript
let p = new Promise(function(resolve, reject) {
  // 执行异步任务
  if(/* good condition */) {
    resolve('Success');
  } else {
    // 传递Error对象的好处是可以包含调用堆栈，便于调试
    reject(Error('Failure'));
  }
});

p.then(function(result) {
  // do something with the reuslt
  foo(result);
}， function(err){
  console.error(err);
});
```

使用Promise则非常的简单，可以调用`Promise`对象的`then()`方法来处理异步计算的结果。`then`接收两个回调函数，
分别是成功的回调函数和失败时的回调函数，这两个参数都是可选的。

Promise的使用有两点需要记住的：

1. `then()`方法可以链式调用
2. `catch()`方法可以作为错误处理语句的语法糖，相当于`then(undefined, function(error) { ... });`

在具体讲解这两点之前，我们先来看一个例子。下面这个例子用于将`XMLHttpRequest`转换为一个基于Promise的接口。
我们以GET请求为例：

```javascript
function get(url) {
  // 返回一个新的 Promise
  return new Promise(function(resolve, reject) {
    // 经典 XHR 操作
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // 当发生 404 等状况的时候调用此函数
      // 所以先检查状态码
      if (req.status == 200) {
        // 以响应文本为结果，完成此 Promise
        resolve(req.response);
      }
      else {
        // 否则就以状态码为结果否定掉此 Promise
        // （提供一个有意义的 Error 对象）
        reject(Error(req.statusText));
      }
    };

    // 网络异常的处理方法
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // 发出请求
    req.send();
  });
}
```

我们现在可以这么调用它：

```javascript
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
});
```

现在我们发起XHR请求便变得简单直观的多了。`story.json`文件的内容如下：

```json
{
  "heading": "<h1>A story about something</h1>",
  "chapterUrls": [
    "chapter-1.json",
    "chapter-2.json",
    "chapter-3.json",
    "chapter-4.json",
    "chapter-5.json"
  ]
}
```

### `Promise.resolve`

有时你无需在promise内完成一个异步任务——如果一个异步动作被执行是可能的话，然而，返回一个Promise是将是最合适的，
因此你可以总是期望从给定函数中产生的promise。在这种情况下，你可以简单的调用`Promise.resolve()`或者`Promise.reject()`，
而无需`new`关键字。例如：


```javascript
var userCache = {};
function getUserDetail(username) {
  // 两种情况下，要么缓存要么不缓存，都将返回一个promise
  
  if (userCache[username]) {
    // 不使用new关键字返回一个promise
    return Promise.resolve(userCache[username]);
  }
  
  // 使用fetch API获取信息
  // fetch返回一个promise
  return fetch('user/' + username + '.json')
    .then(result => {
      userCache[username] = result;
      return result;
    })
    .catch(() => {
      throw new Error('Could not find user: ' + username);
    });
}
```

由于返回的是一个Promise，你可以在返回值上使用`then`和`catch`方法。
可以将`Promise.resolve`看作是`new Promise()`的快捷方式。

### 链式调用

上面我们说过`then()`接收两个参数，分别对应成功和失败时的回调函数。我们还可以将多个`then`方法串联起来，
用于修改结果或执行更多的异步操作。

你可以对结果进行修改，然后返回一个新的值，例如：

```javascript
new Promise(function(resolve, reject) { 
	// A mock async action using setTimeout
	setTimeout(function() { resolve(10); }, 3000);
})
.then(num => { console.log('first then: ', num); return num * 2; })
.then(num => { console.log('second then: ', num); return num * 2; })
.then(num => { console.log('last then: ', num);});

// From the console:
// first then:  10
// second then:  20
// last then:  40
```

每个`then`接收前一个`then`的返回值的结果。

回到之前的`get`函数，我们可以修改返回值的类型，将结果进行一定的转换：

```javascript
get('story.json').then(function(response) {
  return JSON.parse(response);
}).then(function(response) {
  console.log("Yey JSON!", response);
});
```

为了让代码变得更简单，可以再次进行改进：

- 因为`JSON.parse`只接收一个参数，并返回转换后的结果，我们可以直接使用`then(JSON.parse)`
- `then`中的回调函数，我们可以直接使用ES6的胖箭头函数，这样可以让代码更直观

```javascript
get('story.json').then(JSON.parse).then(response => console.log("JSON data: ", response);
```

由于这段代码会被重复调用，我们可以定义一个新的`getJSON`函数：

```javascript
function getJSON(url) {
  return get(url).then(JSON.parse);  // 返回一个获取JSON并加以解析的Promise
}
```

对于串联起来的`then()`方法而言：如果你返回了一个值，那么它就会被传给下一个`then()`的回调。
如果你返回一个“类Promise”对象，则下一个`then()`就会等待这个Promise明确结束（成功/失败）才会执行。

```javascript
getJSON('story.json')
  .then(story => getJSON(story.chapterUrls[0]))
  .then(chapter => console.log("Got chapter 1!, " chapter));
```

在上面的代码中，我们首先发起对`story.json`的异步请求，它会返回给我们一个URL列表，然后我们请求其中的第一个，。

### 错误处理

前面我们已经知道，`then`接收两个参数，一个处理成功时的回调函数，一个处理失败时的回调函数。

```javascript
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.log("Failed!", error);
});
```

你还可以使用`catch`来进行错误处理，实际上，它不过是`then(undefined, func)`的语法糖而已。这样能够让代码更直观：

```javascript
get('story.json')
  .then(response => console.log('Success!', response))
  .catch(error => console.error('Failed!', error));
```

## 并行和串行

异步意味着你不用等待前一件事情做完就可以做后一件事。现在，我们想要遍历所有章节的URL并且依次请求，应该怎么办？
使用传统的方法，你可能会想到`array.forEach`：

```javascript
story.chapterUrls.forEach(chapterUrl => {
  // getJSON是异步操作
  getJSON(chapterUrl).then(chapter => { 
    addHtmlToPage(chapter.html)
  });
});
```

但是这么做并不可行，因为`forEach`并**不支持异步操作**！

### Promise序列

```javascript
// 遍历所有章节的 url
story.chapterUrls.reduce(function(sequence, chapterUrl) {
  // 从 sequence 开始把操作接龙起来
  return sequence.then(() => getJSON(chapterUrl))
    .then(chapter => { 
      addHtmlToPage(chapter.html) ;
    });
}, Promise.resolve());
```

上面的代码中使用了`Promise.resolve()`，它会依据你传入的任何值返回一个Promise。
如果你传给它一个类Promise对象（带有`then`方法），它会生成一个带有同样肯定/否定回调的Promsie。
如果你传给它任何别的值，如`Promise.resolve('hello')`，它会创建一个以该值为完成结果的`Promise`，
如过不传入任何值，则以`undefined`为完成结果。

`reduce`回调会一次应用在每一个数组元素上，第一轮的`sequence`是`Promise.resolve()`，
之后的调用里`sequence`就是上次函数执行的结果。`reduce()`方法非常适合用于把一个值归并处理为一个值。

`Array.prototype.reduce(callback, [initialValue])`方法接收一个函数作为累加器，数组中的每个值（从左到右）开始合并，
最终为一个值。参数二作为第一次调用callback的第一个参数。此外，callback包括四个参数：

- previousValue - 上一次调用回调返回的值，或者是提供的初始值（initialValue）
- currentValue - 数组中当前被处理的元素
- index - 当前元素在数组中的索引
- array - 调用reduce的数组

汇总前面的代码为：

```javascript
getJSON('story.json')
  .then(story => {
    addHtmlToPage(story.heading);
    return story.chapterUrls.reduce((sequence, chapterUrl) => {
      return sequence.then(() => getJSON(chapterUrl))
      .then(chapter => addHtmlToPage(chapter.html));
    }, Promise.resolve());
  })
  .then(() => addTextToPage('All done'))
  .catch(err => addTextToPage('Argh, broken: ' + err.message))
  .then(() => document.querySelector('.spinner').style.display = 'none');
```

辅助方法定义如下：

```javascript
var storyDiv = document.querySelector('.story');

function addHtmlToPage (html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  storyDiv.appendChild(div);
}

function addTextToPage (text) {
  var p = document.createElement('p');
  p.textContent = text;
  storyDiv.appendChild(p);
}
```

### `Promise.all`

浏览器很擅长同时加载多个文件，上面的方法属于一个接一个下载章节，这先得非常的低效。我们希望同时下载所有章节，
全部完成后一次搞定，正好就有这么个API：

```javascript
Promise.all(arrayOfPromise).then(arrayOfResults => {} );
```

`Promise.all`接收一个Promise数组作为参数，创建一个当所有Promise都完成之后就完成的Promise，它的完成结果是一个数组，
包含了所有先前传入的那些Promise的完成结果，顺序和将它们传入的数组顺序一致。

```javascript
getJSON('story.json').then(story => {
  addHtmlToPage(story.heading);
  // 接收一个Promise数组并等待他们全部结束
  // 把章节URL数组转换成对应的Promise数组
  return Promise.all(story.chapterUrls.map(getJSON));
}).then(chapters => {
  // 现在我们有了顺序的章节JSON，遍历它们
  // 并添加到页面中
  chapters.forEach(chapter => addHtmlToPage(chapter.html));
  addTextToPage('All done');
})
  // 捕获过程中的任何错误
  .catch(err => addTextToPage('Argh, broken: ' + err.message))
  .then(() => document.querySelector('.spinner').style.display = 'none');
```

根据连接状况，改进的代码会比顺序加载方式提速数秒，甚至代码行数也更少。章节加载完成的顺序不确定，
但它们显示在页面上的顺序准确无误。

但仍然有改进空间：第一章内容加载完成后，我们向让它立即填进页面，这样用户可以在其他加载任务尚未完成之前就开始阅读。
当第三章到达的时候我们不动声色，第二章也到达之后我们再把第二章和第三章内容填入页面，以此类推。

为了达到这个效果，我们同时请求所有的章节内容，然后创建一个序列依次将其填入页面：

```javascript
getJSON('story.json')
  .then(story => {
    addHtmlToPage(story.heading);

    // 把章节 URL 数组转换成对应的 Promise 数组
    // 这样就可以并行加载它们
    return story.chapterUrls.map(getJSON)
      .reduce((sequence, chapterPromise) => {

        // 使用 reduce 把这些 Promise 接龙
        // 以及将章节内容添加到页面
        return sequence

          // 等待当前 sequence 中所有章节和本章节的数据到达
          .then(() => chapterPromise)
          .then(chapter => { addHtmlToPage(chapter.html) });
      }, Promise.resolve());
  })
  .then(() => { addTextToPage("All done") })
  // 捕获过程中的任何错误
  .catch(err => { addTextToPage("Argh, broken: " + err.message) })
  .then(() => { document.querySelector('.spinner').style.display = 'none' });
```

## References

1. [JavaScript Promise API](https://davidwalsh.name/promises)
2. [JavaScript Promise: There and Back Again](http://www.html5rocks.com/zh/tutorials/es6/promises)
3. [Promise迷你书](http://liubin.org/promises-book/)
4. [MDN: Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)