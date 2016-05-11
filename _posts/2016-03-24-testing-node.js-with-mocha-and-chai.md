---
layout: post
title: 使用Mocha和Chai来测试Node.js应用
category: technique
---

随着应用程序规模的越加复杂化，要确保代码的稳定性越来越困难。测试是可重复的代码片段，
可以对应用程序以期望的方式进行工作做出断言，从而保证代码质量。对于Node.js开发而言，
开发人员要极其关注其代码的测试环节，因此本文将会详细的介绍Node.js程序的测试方案，
介绍如何使用Mcha和Chai来测试你的Node,js应用。

<!--more-->

## 测试

### 从零开始

我们需要为我们编写的程序提供测试。例如，测试可以是：

- 某个HTTP响应是否返回200代码？
- 某个方法是否返回特定的值？
- 某个方法是否返回一个字符串？某个方法是否接收两个参数、执行计算然后返回正确的数？

通过测试，当开发者对代码做出修改之后，可以确认不会给应用程序引入新的bug或错误。此外，
有些开发人员也使用测试来驱动应用程序的创建，这个过程称之为测试驱动开发（TDD），
可以参考我[之前写过的一篇博文](http://wwsun.github.io/posts/tdd.html)。

### TDD vs BDD

上面我们大致了解了测试驱动开发TDD。此外，许多开发人员还喜欢使用行为驱动的开发（BDD）。
BDD从外部考虑应用程序，而不是从内部测试程序的工作情况。例如：

> 例1：当用户注册时，应用程序应当接收POST请求，检查字段是否有效，然后将数据库中的用户数量递增1。

上面这个例子更接近于TDD，开发人员以应用程序应该有的功能为出发点为应用程序代码编写测试。

> 例2：作为一个用户，当我成功注册时，我应该看到“感谢注册”。

例2描述用户如何与应用程序交互以及他们期望看到的是什么。目前，Node.js社区的趋势是使用BDD，而不是TDD。
BDD更容易让相关人员介入到测试中。在BDD中，测试是以应用程序与来自外界的交互为基础，而不需要理解应用程序的内部原理。

### 编写可测试代码

编写可测试代码的几个原则：

- 单一职责：让你的代码逻辑尽可能的单一，分离不同的功能，这样可以让代码更容易被测试
- 接口抽象：目标是针对接口进行测试，而具体代码实现的变化不影响为接口编写的单元测试
- 层次分离：代码分层，可以进行逐层测试

### 单元测试

单元测试主要包括断言、测试框架、测试用例、测试覆盖率、Mock、持续集成几个方面，对于Node而言，
还要加入异步代码测试和私有方法测试这两个部分。

**断言**

断言就是单元测试中用来保证最小单元是否正常的检测方法。Node中有一个`assert`模块，
它是一个简单的测试框架，提供了一组断言方法，让开发人员得以为Node.js应用创建低级测试，
并且很多的主要模块都调用了这个模块，感兴趣的话，可以具体看一下它的[api文档](https://nodejs.org/api/assert.html)。

断言通常用于检查程序在运行时是否满足某个期望。一个简单的例子如下：

```javascript
var assert = require('assert');
assert.equal(Math.max(1, 100), 100);
```
    
如果期望不能满足，会抛出`AssertionError`异常，整个程序将会停止执行。

**题外话：JavaScript中比较相等**

1. 使用`==`运算符

```javascript
"8" == 8 // true
'' == '0' // false
0 == `` // true
```

2. 使用`===`运算符：它检查值是否是相同的值，以及是否是相同的类型

```javascript
"8" === 8 // false
'' === '0' // false
0 === '' // false
```

**测试框架**

测试框架用于为测试服务，本身并不参与测试，主要用于管理测试用例和测试报告，提升测试用例的开发速度、可维护性和可读性。
后面我们会介绍Node中最常用的测试框架[Mocha](http://mochajs.org/)。

有关Node中单元测试的更多内容，可以参考朴灵的《[深入浅出Node.js](http://www.ituring.com.cn/book/1290)》的第10章，
该书给出了较为完整的介绍。下面我们进入实践单元，来具体的介绍如何进行Node程序代码的单元测试。

## Moach

Mocha 是一个JavaScript的测试框架，而chai是一个断言库，两者搭配使用更佳。
Mocha允许开发者使用模块化方法测试Node.js应用程序，Mocha非常的简单易学，
在Node和浏览器都可运行。Mocha的功能非常丰富，能够让异步测试变得简单有趣。
Mocha在运行测试用例过程中，当捕获到错误时，依旧能够灵活地运行精确的报告。

### 示例程序

访问[Mocha](http://mochajs.org/)的官网，有一个简单的tutorial，我们可以跟着流程走一遍。

在node项目中进行安装：

	npm install mocha --save-dev  // npm install mocha -g
	npm install chai

官方的示例程序大致如下：

```javascript
// test.js

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});
```

然后，在`package.json`中的`scripts`属性中加入`"test": "mocha test.js"`。
如果你全局安装了Mocha，只需要在命令行中定位到测试文件下运行`mocha`命令即可。
或者，我们建议使用`npm run test`命令来执行测试。
	
下面来介绍，上面所写的单元测试中所涉及到的几个关键方法：

`describe(moduleName, callback)`

描述一句测试用例是否正确。首先`describe`是可以嵌套的，多个`describe`嵌套的使用用于描述模块下的子模块的关系，
上面的代码的意思就是测试`Array`这个类下面的`#indexOf()`方法, `moduleName`是可以随便定义的，即是是中文也可以。 
`“#”`的使用也是一般约定，不喜欢你也会换个或不用也可以。

`it(info, callback)`

真正的测试语句是在`it`函数的回调里面，`info`也是一句描述性的说明，看得懂就行。
`callback`里面的断言决定这条测试是否正确。如果失败的话控制台会把log打印出来。
一个`it`对应一个测试用例，里面可以有多条断言或一条断言。

`assert.equal（exp1,exp2）`

mocha的断言语句，`exp1`是否等于`exp2`. 其他更多用法可以查考mocha的文档，但是这里一般我们使用`chai`来作为断言库。
更加友好的实现我们的断言方式。

Mocha鼓励用户使用简单直白的英语以BDD风格来描述应用程序。例如：

```javascript
describe('Comparing strings', function () { } );
describe('when comparing different strings', function() { } );
```


### 异步代码测试

上面的代码是同步代码，非常的简单。我们来看看异步代码的测试，对于Mocha而言也很简单。
只需要在测试完成的时候调用回调即可。看下面的代码：

```javascript
describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) throw err;
        done(); // 通过使用 done() 回调的方法来表示测试完成
      });
    });
  });
});
```
    
其中`user.save()`是一个需要连接数据库的异步操作。和前面代码不同的是，这里使用了`done`作为回调函数（通常都这么命名），
作为约定，Mocha会等到其执行完毕。为了简化问题，回调函数`done()`能够接收错误，因此代码可以简化为：

```javascript
it('should save without error', function(done) {
  var user = new User('Luna');
  user.save(done);
});
```

### 使用Promise

当然，如果不想使用回调的话，你也可以返回[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，
示例如下：

```javascript
// 在每次单元测试前执行
beforeEach(function() {
  return db.clear()
    .then(function() {
      return db.save([tobi, loki, jane]);
    });
});

describe('#find()', function() {
  it('respond with matching records', function() {
    return db.find({ type: 'User' }).should.eventually.have.length(3);
  });
});
```

你可以参考[chai-as-promised](https://www.npmjs.com/package/chai-as-promised)这个库。

### 钩子

Mocha提供的钩子包括`before()`, `after()`, `beforeEach()`, `afterEach()`，可以用于测试的预处理和后处理等通过。

```javascript
describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
});
```
	
当然，对于钩子，你可以提供描述信息，只需要提供一个参数即可（或者使用命名的函数作为回调）：

```javascript
beforeEach('some description', function() {
  // beforeEach:some description
});
```

### 待处理的测试（pending tests）

就是it里面的function留空。mocha默认会pass这条测试。这样的用法其实相当于，某项目负责人定义好了要测试什么内容，
之后由相应的开发去实现具体。

```javascript
describe('Array', function() {
  describe('#indexOf()', function() {
    // pending test below
    it('should return -1 when the value is not present');
  });
});
```
    
有关Mocha的其他特性可以参考Mocha的官方网站提供的示例，都非常的简单，强烈建议阅读作为入门。

## Chai

Chai是一个BDD/TDD模式的断言库，也可以同时运行在node和浏览器环境，能够高效的和绝大多数JavaScript测试框架搭配使用。
BDD，行为驱动开发（注重测试逻辑），TDD是测试驱动开发（注重输出结果）。下面的例子主要使用的BDD。

关于Chai，我推荐你也从[官方示例](http://chaijs.com/guide/styles/)入手。有关Chai，我们主要关注的是BDD的测试代码风格。
看一个例子：

```javascript
// BDD: should
var should = require('chai').should() //actually call the function
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

foo.should.be.a('string');
foo.should.equal('bar');
foo.should.have.length(3);
beverages.should.have.property('tea').with.length(3);

// BDD: expect 推荐使用
var expect = require('chai').expect
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.length(3);
expect(beverages).to.have.property('tea').with.length(3);
```
    
BDD风格主要包括两个方法，分别是`expect`和`should`。都可以通过链接的方式构造断言，但主要区分在于断言的初始构造。
`should`的风格非常接近于自然语言。我们可以使用Chai的`should`替代`Mocha`中的`assert`。

两者的区别是什么？`expect`需要的只是对象的引用，而`should`需要函数先执行。
`expect`接口提供的函数可以作为链接断言的起点，并且适用于Node和所有的浏览器环境，
而`should`接口继承自`Object.prototype`，提供的仅仅是一个getter作为链接断言的起点，并且不能再IE浏览器上工作。

更多内容，还是推荐你阅读Chai的官方文档和[BDD的API](http://chaijs.com/api/bdd/)。

## Reference

1. http://segmentfault.com/a/1190000003949229
1. http://mherman.org/blog/2015/09/10/testing-node-js-with-mocha-and-chai
1. http://www.alloyteam.com/2013/12/hour-class-learning-costs-javascript-unit-testing-tool-matcha-mocha-and-chai