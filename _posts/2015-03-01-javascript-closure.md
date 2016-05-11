---
layout: post
title: 理解JavaScript的闭包
category: technique
---

在JavaScript中，闭包是个常令新手困惑的术语，并且很容易和匿名函数相混淆。一句话来讲，
闭包是指有权访问另一个函数（嵌套函数）作用域中的变量的函数。本文将着重解释JavaScript中的闭包概念，
及其用法。

<!--more-->

> A closure is a function plus the connection to the variables of its surrounding scopes.

在讨论闭包之前，我们先回顾一下JavaScript中的词法作用域的概念。

## 词法作用域

处于种种原因，有时候我们**需要得到函数内部的局部变量**。通常情况下，这是无法做到的（函数内部变量属于局部变量），
只有通过变通方法才能实现。我们需要在函数内部再定义一个函数。比如有下面这个[例子（在JSFIDDLE查看）](http://jsfiddle.net/xAFs9/3/)：

```javascript
function init() {
    
  var name = "Mozilla"; // name是一个局部变量
	    
  // 内部函数，它是一个闭包
  function displayName() {
     console.log(name); // displayName()使用了外部函数中定义的变量    
  }
displayName();    
}

init();
```

上面的代码中，函数`displayName`是函数`init`的内函数，我们发现，可以在`displayName`中访问`init`的局部变量，但反过来却不可以。
也就是`displayName`内部的局部变量对`init`是不可见的。这就是Javascript语言特有的"链式作用域"结构（chain scope），
**子对象会一级一级地向上寻找所有父对象的变量**。所以，父对象的所有变量，对子对象都是可见的，反之则不成立。

简单的说，内函数`displayName()`之所以能访问外函数中的`name`变量是因为JavaScript中的词法作用域的作用：
在avaScript中，变量的作用域是由它在源代码中所处位置决定的（词法），并且嵌套的函数可以访问到其外层作用域中声明的变量。

## 闭包

既然`displayName`可以访问`init`的局部变量，那么只要把`displayName`返回，
我们不就可以在`init`的外部读取到它的内部变量了吗！

现在考虑下面这个[例子](http://jsfiddle.net/wwsun/tyyqjn4y/)：

```javascript
function makeFunc() {
  var name = "Mozilla";

  // 内函数可以访问外部函数的局部变量
  function displayName() {
    console.log(name);
  }
  return displayName; // 返回内部函数
}

var myFunc = makeFunc(); // myFunc成为了闭包
myFunc();  // Mozilla
```

代码的运行结果并没有变，所不同的是，内函数`displayName()`在**执行之前被外函数返回了**。

这段代码看起来别扭却能正常运行。通常，函数中的局部变量仅在函数的执行期间可用。
一旦 `makeFunc()` 执行过后，我们会很合理的认为 `name` 变量将不再可用。虽然代码运行的没问题，但实际并非如此。

对这一问题的解释就是，`myFunc`变成成一个**闭包**了。闭包是一种特殊的对象，它由两部分构成：

- 函数：`displayName()`
- 创建该函数的环境：环境由闭包创建时在作用域中的任何局部变量组成，即局部变量`name`

你可以简单的理解为：闭包就是能够读取其他函数内部变量的函数。而闭包通常是“定义在函数内部的函数”。
我们可以认为，闭包充当了函数内部和函数外部连接起来的桥梁。

创建闭包的一个常见方式就是在一个函数内部创建另一个函数。

### 闭包用途

1. 读取函数内部的变量
1. **让这些变量的值始终保存在内存中**

注意，因为闭包会使得函数中变量都保存在内存中，因此不能滥用闭包，否则会造成内存溢出。

### 作用域链

之所以能访问这个变量，是因为内部函数的作用域链中包含了外函数`makeFunc()`的作用域。
要搞清楚其细节，就有必要了解作用域链（Scope Chain）的相关知识：

当某个函数第一次被调用时，会创建一个执行环境及相应的作用域链，
并把作用域链赋值给一个特殊的内部属性（即[scope]）。然后，
使用`this`、`arguments`和其他命名参数的值来初始化函数的活动对象。
但在作用域链中，外部函数的活动对象始终处于第二位，
外部函数的外部函数的活动对象处于第三位...直至作为作用域链终点的全局执行环境。

下面是一个[更有趣的例子](http://jsfiddle.net/wwsun/kzmLLrg3/)，一个`makeAddr`函数：

```javascript
function makeAddr(x) {
  return function(y) {
    return x+y;  // 在内函数中访问外函数中的变量x
  };
}

// add5和add10都是闭包
var add5 = makeAddr(5);
var add10 = makeAddr(10);

console.log(add5(2)); // 7
console.log(add10(2)); // 12
```

在这个例子中，我们定义了函数`makeAddr(x)`, 其接收唯一的参数`x`，并且返回了一个新的函数。
被返回的函数也接收唯一的参数`y`，并返回`x`和`y`的和。

本质上，`makeAddr`可以认为是一个函数工厂——它创建了一个函数族，可以通过指定参数用来增加一个指定值。
在上面的例子中，我们使用这个函数工厂创建了两个新的函数，分别为add5和add10，一个用来增加5，另一个用来增加10。

`add5`和`add10`都是闭包。它们共享相同的函数体定义，但是存放了不同的环境。
在`add5`的环境中，`x`的值为5；而在`add10`的环境中，`x`的值为10。

## 闭包的三个事实

付出努力掌握闭包将会给你带来超值的回报。理解闭包的三个事实：

1. JavaScript允许你引用在当前函数意外定义的变量（依赖于词法作用域的作用）

	```javascript
	function makeSandwich() {
		var magicIngredit = "peanut butter";
		function make(filling) {
			return magicIngredient + " and " + filling;	
		}	
		return make("jelly");
	}
	
	makeSandwich(); // "peanut butter and jelly"
	```
	
2. 即使外部函数已经返回，当前函数仍然可以引用外部函数所定义的变量

```javascript
function sandwichMaker() {
  var magicIngredient = "peanut butter";
  function make(filling) {
    console.log(magicIngredient + " and " + filling);
  }
  return make;
}

var f = sandwichMaker(); // f是一个闭包
f("jelly"); 		// "peanut butter and jelly"
f("bananas");		// "peanut butter and bananas"
f("marshmallows");	// "peanut butter and marshmallorws"
```


  `f`的值实际上是内部返回的`make`函数，调用`f`也就是调用`make`。但即使`sandwichMaker`函数已经返回，
  `make`函数仍然能记住`magicIngredient`。
  
  JavaScript中**函数是一等公民**，函数包含了比调用它们执行时所需要的代码还要多的信息。并且，
  JavaScript函数值还在内部存储它们可能会引用的定义在其封闭作用域的变量。
  **那些在其所涵盖的作用域内跟踪变量的函数被称为闭包**。
  
  所以，`make`就是一个闭包，其代码引用了两个外部变量：`magicIngredient`和`filling`。
  每当`make`函数被调用时，其代码都能引用到这两个变量，因为该闭包存储了这两个变量。
  
3. **闭包可以更新外部变量的值**

  实际上，**闭包存储的是外部变量的引用，而不是它们的值的副本**。因此，对于任何具有访问这些外部变量的闭包，
  都可以进行更新。看一个例子就明白了：
  
```javascript
function box() {
  var val = undefined;
  return {
    set: function (newVal) { val = newVal; },
    get: function () { return val; },
    print: function () { console.log(val); },
    type: function () { return typeof val; }
  };
}

var b = box();
b.type();		// "undefined"
b.set(87.6);
b.get();		// 87.6
b.type();		// "number"
b.print();  // 87.6
```

## 闭包实战

上面我们已经讲完了闭包的理论部分，下面我们试着从实战角度看看闭包的具体应用。
**闭包允许将函数与其所操作的某些数据（环境）关连起来**。这显然类似于面向对象编程。
在面对象编程中，对象允许我们将某些数据（对象的属性）与一个或者多个方法相关联。

因而，一般说来，可以使用只有一个方法的对象的地方，都可以使用闭包。

在 Web 中，您可能想这样做的情形非常普遍。大部分我们所写的 Web JavaScript 代码都是事件驱动的 — 
定义某种行为，然后将其添加到用户触发的事件之上（比如点击或者按键）。我们的代码通常添加为回调：
响应事件而执行的函数。

[这个例子](http://jsfiddle.net/vnkuZ/)是这样的：假设我们想通过增加一些按钮来调整页面字体的大小。
一种方法是通过指定body元素在像素单位下的font-size，然后设置页面中其他元素使用`em`作为单位。

CSS代码如下：

```css
	body {
	  font-family: Helvetica, Arial, sans-serif;
	  font-size: 12px;
	}
	
	h1 {
	  font-size: 1.5em;
	}
	h2 {
	  font-size: 1.2em;
	}
```

我们通过点击按钮来改变body元素的字体大小，因为页面其他元素使用了相对单位`em`，
因此字体大小会相应的被调整。JavaScript代码如下：

```javascript
function makeSizer(size) {
  return function() {
	document.body.style.fontSize = size + 'px';
  };
}
	
var size12 = makeSizer(12);
var size14 = makeSizer(14);
var size16 = makeSizer(16);
```
	
函数`size12`, `size14`, `size16`分别用来调整body文本的大小为12，14， 16像素。
然后，我们可以将其与按钮元素绑定，如下：

```javascript
document.getElementById('size-12').onclick = size12;
document.getElementById('size-14').onclick = size14;
document.getElementById('size-16').onclick = size16;
```

html代码如下：

```html
<p>Some paragraph text</p>
<h1>some heading 1 text</h1>
<h2>some heading 2 text</h2>

<a href="#" id="size-12">12</a>
<a href="#" id="size-14">14</a>
<a href="#" id="size-16">16</a>
```

## 使用闭包来仿造私有方法

在Java中你可以声明私有方法，私有方法表示只能在当前类中使调用该方法。
但是JavaScript并没有提供一个直接的方法去声明私有方法，但是可以使用闭包来仿造私有方法。
私有方法的作用不仅仅在于可以有效的限制代码的访问，
也为管理你的全局命名空间提供了一种强有力的方式，使得无关的方法不被公开的暴露出来。

下面来看如何**定义可以访问私有函数和变量的公共函数**，我们使用闭包来达到这一目的，
这也被称为[模块模式](https://www.google.com.hk/search?q=javascript+module+pattern&gws_rd=cr)：

```javascript
// 所定义的匿名函数表达式会立即执行，并将返回对象（含有三个方法）赋值给counter
var counter = (function() {
  var privateCounter = 0;

  function changeBy(val) {
    privateCounter += val;
  }

  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  };
})();

console.log(counter.value()); // 0
counter.increment();
counter.increment();
console.log(counter.value()); // 2
counter.decrement();
console.log(counter.value()); // 1
```

这里有好多细节。**在以往的示例中，每个闭包都有它自己的环境；而这次我们只创建了一个环境，为三个函数所共享**，
分别是：`counter.increment`, `counter.decrement`, `counter.value`。

被共享的环境是在一个匿名函数的函数体内被创建的，这将会在其被定义后立即执行（立即执行函数 IIFE）。
这个共享环境包含两个私有项：变量`privateCounter`和函数`changeBy`，
外界无法直接访问匿名函数内部的这两个私有项。取而代之的是，只能通过访问三个公开的接口函数，也就是被匿名函数返回的三个函数。

**这三个公共函数是共享同一个环境（共享相同的`privateCounter`和`changeBy()`）的闭包**，
而它们之所以都可以访问变量`privateCounter`和函数`changeBy`，是因为JavaScript词法作用域的作用。

您应该注意到了，我们定义了一个匿名函数用于创建计数器，然后直接调用该函数，并将返回值赋给 `counter` 变量。
也可以将这个函数保存到另一个变量中，以便创建多个计数器。

```javascript
// 此时我们没有使用立即执行函数表达式，而是直接定义了一个匿名函数
var counter = function() {
  var privateCounter = 0;

  function changeBy(val) {
    privateCounter += val;
  }

  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  };
};

// 我们可以借助counter创建两个不同的计数器
var counter1 = counter();
var counter2 = counter();

// 每个计数器都有自己独立的环境
counter1.decrement();
counter1.decrement();
counter2.increment();

console.log(counter1.value());  // -2
console.log(counter2.value());  // 1
```

可以发现，这两个计数器是彼此独立的，它们的环境在函数`counter()`在调用期间是彼此不同的。
闭包变量`privateCounter`在每一次包含不同的实例。

利用这种方式使用闭包可以向OOP编程一样提供非常多的好处，尤其是**数据隐藏和封装**。

### 补充：立即执行函数 IIFE

通过IIFE这种方式我们可以构造块作用域，通常的模式为：

```javascript
// 这是个立即执行的函数表达式，相当于Java中的一个普通的块作用域（里面的变量为局部变量）
(function () {
  var tmp = ...; // 这里的tmp就是个局部变量
	
}());
```
	
IIFE是一种函数表达式，它在被定义后立即被调用。而在函数内部定义的变量自然是局部变量。

## 在循环中创建闭包：一个常常会犯的错误

在ES6引入`let`关键字之前，闭包的一个很常见的问题发生在循环中创建闭包。
考虑下面[这个例子](http://jsfiddle.net/v7gjv/)：

HTML代码如下：

```html
<p id="help">Helpful notes will appear here</p>
<p>E-mail: <input type="text" id="email" name="email"></p>
<p>Name: <input type="text" id="name" name="name"></p>
<p>Age: <input type="text" id="age" name="age"></p>
```

JavaScript代码如下：

```javascript
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
    {'id': 'email', 'help': 'Your e-mail address'},
    {'id': 'name', 'help': 'Your full name'},
    {'id': 'age', 'help': 'Your age (you must be over 16)'}
  ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    }
  }
}

setupHelp();
```

在`helpText`数组中我们定义了三个提示信息，每个都使用ID与html文档中的输入域相关联。
通过循环来迭代这些提示信息，将其分别与三个输入框的`onfocus`事件绑定，以在用户聚焦在不同的输入框时提示不同的信息。

如果你试着运行这些代码，会发现其并不会正常工作，无论你的焦点在哪个输入框中，提示都是关于年龄的那条信息。

该问题的原因在于赋给 `onfocus` 是闭包（showHelp）中的匿名函数而不是闭包对象；
在闭包（showHelp）中一共创建了三个匿名函数，但是它们都共享同一个环境（item）。
**在 onfocus 的回调被执行时，循环早已经完成**，且此时 `item` 变量（由所有三个闭包所共享）已经指向了 `helpText` 列表中的最后一项。

> 闭包只能取得包含函数中任何变量的最后一个值！闭包保存的是整个变量对象，而不是某个特殊的变量。

解决这个问题的一种方案是使`onfocus`指向一个新的闭包对象。

```javascript
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function makeHelpCallback(help) {
  return function() {
    showHelp(help);
  }
}

function setupHelp() {
  var helpText = [
    {'id': 'email', 'help': 'Your e-mail address'},
    {'id': 'name', 'help': 'Your full name'},
    {'id': 'age', 'help': 'Your age (you must be over 16)'}
  ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = makeHelpCallback(item.help);
  }
}

setupHelp();
```

这段代码可以如我们所期望的那样工作。所有的回调不再共享同一个环境， 
`makeHelpCallback` 函数为每一个回调创建一个新的环境
。在这些环境中，`help` 指向 `helpText` 数组中对应的字符串。
[完整代码](http://jsfiddle.net/wwsun/grp341z3/)。

## 性能问题

由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存，
过多使用闭包会使内存被占用过多，因此需要慎重使用闭包。

例如，在创建新的对象或者类时，方法通常应该关联于对象的原型，而不是定义到对象的构造器中。
原因是这将导致每次构造器被调用，方法都会被重新赋值一次（也就是说，为每一个对象的创建）。

可以考虑一下下面的这个例子：

```javascript
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
  
  this.getName = function() {
    return this.name;
  };

  this.getMessage = function() {
    return this.message;
  };
}
```

这里的代码中并没有得到任何有关闭包的好处，因此可以重构为：

```javascript
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}

MyObject.prototype = {
    
  getName: function() {
    return this.name;
  },
  
  getMessage: function() {
    return this.message;
  }
};
```

但是，重新定义原型显然也不是什么好方法，并且也是不被推荐的。
因此，更好的做法是将方法追加到已有原型上：

```javascript
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}

MyObject.prototype.getName = function() {
  return this.name;
};

MyObject.prototype.getMessage = function() {
  return this.message;
};
```

在前面的例子中，被继承的原型可以被所有对象所贡献，并且方法定义也无需在每个对象创建时重新书写。
你可以参考JavaScirpt的[对象模型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)了解更多的内容。

## References

1. http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html
1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
1. JavaScript高级程序设计，第3版，第7章
1. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Closures
1. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
1. Effective JavaScript, ch2, Item 11