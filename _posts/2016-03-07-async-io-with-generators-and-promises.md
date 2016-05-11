---
layout: post
title: 使用Generators和Promises实现异步I/O
category: knowledge
---

本文主要介绍的是如何利用ES6的生成器来设计API，用于解决异步的数据输入和输出问题。
此外，还能够使用Promise来将一组操作链接起来。

<!--more-->

## Statement

- **原文地址：**https://ponyfoo.com/articles/asynchronous-i-o-with-generators-and-promises
- **译者：**[景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。

对我而言，在阅读一本工程技术类的书籍而言，其中最有趣的部分往往是其中的示例部分，
并且对于作者而言，示例部分也是在写一本引人入胜的技术材料时最难的以部分。
我发现最好的例子是那些能够带着你思考API设计和编码实践的例子，而不是那些单纯的介绍特定语言特性的例子。
即使这样，如果你已经通过实例理解了语言特性，你可能还是要通过一些有趣的例子来发现其使用价值（practical）。

下面所描述的问题的例子包括了寻找在生成器函数中使用`return`语句的用处。
[正如我们知道的那样](https://ponyfoo.com/articles/es6-generators-in-depth)，
生成器函数对待`return`语句的方式与`yield`表达式并不同。我们先来看下面这个使用生成器的例子：

```javascript
function* numbers() {
  yield 1;
  yield 2;
  return 3;
  yield 4;
}
```

如果我们使用`Array.from(numbers()), [...numbers()]`，或者甚至是一个`for...of`循环，
我们将只能看到输出结果为`1`和`2`。然而，如果我们更进一步的，并使用生成器对象的话，
我们将在输出结果中看到`3` —— 即使迭代器结果会提示`done: true`。

```javascript
var g = numbers();
console.log(g.next());
// <- { done: false, value: 1 }
console.log(g.next());
// <- { done: false, value: 2 }
console.log(g.next());
// <- { done: true, value: 3 }
```

在上面我所给出的例子中，函数调用的其实是一个生成器函数（`numbers`），
我们通过`yield`关键字获取需要被持有的资源，然后在你需要保存（persist）这些资源的时候，
`return`端点（endpoint）。迭代器将会每次一个的拉取资源，并最终为每一个资源推送数据到另一个端点，
可以假定为将所有的数据保存在一个对象中。

## API设计

上面所说的问题中的API可以参考下面的代码。`saveProducts`方法将会`GET`一系列产品的JSON描述，
并且将产品的数据`POST`到用户的购物车中。

```javascript
saveProducts(function* () {
  yield '/products/javascript-application-design'; // 获取产品1
  yield '/products/barbie-doll'; // 获取产品2
  return '/cart'; // 将产品1和2的数据上传给购物车
});
```

此外，我认为如果`saveProducts`能返回一个`Promise`对象的话将会变得更加每秒，
因为这意味着开发者可以在产品被保存到购物车后，继续[链接一系列的其他操作](https://ponyfoo.com/articles/es6-promises-in-depth)。
例如：

```javascript
saveProducts(productList)
  .then(data => console.log('Saved', data));
```

当然，也可以加入一些条件逻辑来允许这个假设方法能够将产品保存到心愿列表中，而不是保存到购物车中。

```javascript
saveProducts(function* () {
  yield '/products/javascript-application-design';
  yield '/products/barbie-doll';
  if (addToCart) {
    return '/cart'; // 保存到购物车
  }
  return '/wishlists/nerd-items'; // 保存到心愿列表
})
```

这个例子也可以应用到服务端，每一个被yield的值都可能导致一次数据库查询，
并且所返回的值也可以表示某种我们想要保存回数据库中的对象。相似的，迭代器可以决定所yield输入值被处理的节奏：

- 可以是一个非常简单的同步队列
- 可以是并行处理所有查询
- 可以是一个有限并发的并行队列

无论如何，API可以或多或少的保持一致，这取决于消费者是否希望在生成器中使用产品数据。

## 实现`saveProducts`

首先，在上面所讨论的问题中的方法中接收了一个生成器，并初始化了该生成器对象用于迭代生成器函数所产生的值。

```javascript
function saveProducts (productList) {
  var g = productList; // productList是一个生成器函数
}
```
### 简单实现

使用简单的实现方案，我们可以在一个异步序列模式中逐个的拉取产品。代码片段如下所示，
该例子使用了`fetch`来拉取用户提供的生成器所yield的资源 —— 作为JSON。

```javascript
function saveProducts (productList) {
  var g = productList(); // productList是一个生成器函数
  var item = g.next();
  more();
  
  function more () {
    if (item.done) {
      return;
    }
    fetch(item.value)
      .then(res => res.json())
      .then(product => {
        item = g.next(product);
        more();
      });
  }
}

```

> 通过调用`g.next(product)`，我们能够允许消费者通过`data = yield '/resource'`这种方式读取产品数据。

到目前为止，我们拉取所有的数据（获取商品信息），并将它传递回（保存到购物车），对于生成器而言是逐个的进行传递的，
这让我们感觉代码好像是同步的一样。为了能够利用`return`语句，我们需要将产品保存到一个临时的数组中，
当迭代结束的时候，我们再将它们`POST`回去（保存到购物车）。

```javascript
function saveProducts (productList) {
  var products = [];
  var g = productList();
  var item = g.next();
  more();
    
  function more () {
    if (item.done) {
      save(item.value);
    } else {
      details(item.value);
    }
  }
  
  // 获取商品信息
  function details (endpoint) {
    fetch(endpoint)
      .then(res => res.json())
      .then(product => {
        products.push(product);
        item = g.next(product);
        more();
      });
  }
  
  // 保存产品列表数据
  function save (endpoint) {
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ products })
    });
  }
}

```

此时，我们获取了产品的描述信息，并将它们缓存到了`products`数组中，转发给生成器的函数体，
并最终通过`return`语句所提供的端点进行保存。那么如何支持`Promise`呢？这些非常容易添加进来：
`fetch`返回的是一个`Promise`对象，并且它`return` all the way down。

```javascript
function saveProducts (productList) {
  var products = [];
  var g = productList();
  var item = g.next();
  return more();
  
  function more () {
    if (item.done) {
      return save(item.value);
    }
    return details(item.value);
  }
  
  function details (endpoint) {
    // 直接返回fetch
    return fetch(endpoint)
      .then(res => res.json())
      .then(product => {
        products.push(product);
        item = g.next(product);
        return more();
      });
  }
  
  function save (endpoint) {
    // 直接返回fetch
    return fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ products })
      })
      .then(res => res.json());
  }
}
```

> 我们也需要将`save`操作的响应结果转型为JSON，这样链接到`saveProducts`上的Promise链就可以利用响应结果中的`data`对象了。

正如你所看到的那样，该实现方法并没有对该操作的任何重要的方面进行硬编码实现，这意为着你可以在其他场景范范的使用这种模式，
也就是说，如果你拥有零个或多个输入，并且想要将它们拼接到同一个输出管道中。对消费者而言，它们最终获取到的是一个具有非常优雅外观的方法，
并且易于理解 —— 它们只需要`yield`输入值，并`return`输出值。此外，我们通过使用promise来使其更易于与其他操作相拼接。
这种方式下，我们能够控制条件语句和流程控制机制中的潜在混乱，这是通过将流程控制抽象到`saveProducts`方法的迭代机制中进行实现的。