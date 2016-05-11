---
layout: post
title: 谈一谈JavaScript中的动态this值
category: technique
---

对于大部分的JavaScript初学者而言，该语言中的`this`臭名狼籍。JavaScript中的`this`
值取决于它被调用的时机。本文，我们就来讨论一下这个奇怪的特性。

<!--more-->

## 令人烦恼的动态`this`

在JavaScript中，`this`的动态特性总是令人烦恼。对于新手而言，总是不知道如何去判断当前的`this`值。

事实是，[规则非常的简单](https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes)。
我们先看一个例子：

```javascript

"use strict";

const polyglot = {
    name : "Weiwei SUN",
    languages : ["Chinese", "English", "Italian", "German", "Polish"],
    introduce : function () {
        // this.name is "Weiwei SUN"
        const self = this;
        this.languages.forEach(function(language) {
            // this.name is undefined, so we have to use our saved "self" variable 
            console.log("My name is " + self.name + ", and I speak " + language + ".");
        });
    }
}

polyglot.introduce();
```

在`introduce`中，`this.name`的值为`undefined`。在回调函数的外部，
在我们的`forEach`循环中，它指向`polyglot`对象。在多数情况下，我们的直觉会告诉我们，
回调函数中的`this`和回调函数外部的`this`应该是指向同一个对象，然而事实缺并非如此。

> 在JavaScript中，`this`始终指向当前函数的调用者。所有的回调函数在事件循环中被调用。

还有一个相似的例子是构造了一个高阶函数的情况，此时内函数与外函数的`this`指向也会不同。
例如，下面这个例子：

```javascript
var BindingMixin = {
    handleChange: function (key) {
        
        // 此时this值会被解释器重新设置，从而丢失原来的this值
        var that = this;
	    
        return function (event) {
	      var newState = {};
	      that.setState(newState);
	    }
	  }
}
```

问题在于，在JavaScript中，函数中的`this`总是取决于它们的实际调用者，
大体上可以包括[四个规则](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20&%20object%20prototypes/ch2.md)。
这个机制就是所谓的动态`this`。

这意味着，当JavaScript解释器寻找`this`的值的时候，它将会找到其中的一个，
但对于回调函数的而言，其内部的`this`和外部的`this`却并非同一个。一般有两种解决方案：

1. 将`this`作为外部函数的局部变量进行保存，通常命名为`this`，正如上面的例子中展示的那样，
然后在内函数中。
2. 在内函数中调用`bind()`方法，用于设定`this`的值。

这些方法虽然有效，但却有点晦涩。

或者，我们换一种思路，哪函数不再设置它们的`this`值，JavaScript将会寻找`this`的值。
就像寻找其他变量的值那样：逐层返回到上一层作用域中寻找，直到发现同名变量。这样的话，
我们就可以正确的使用到`this`变量的值，也就是所谓的 词法的`this`。

## 使用箭头函数来实现 词法的`this`

从ES2015开始，我们可以这么做了。箭头函数并不会绑定`this`值，从而允许我们利用`this`关键字的词法绑定。
我们可以对上面的代码进行重构：

```javascript
"use strict";

let polyglot = {
    name : "Weiwei SUN",
    languages : ["Chinese", "English", "Italian", "German", "Polish"],
    introduce : function () {
        this.languages.forEach((language) => {
            console.log("My name is " + this.name + ", and I speak " + language + ".");
        });
    }
}

```

现在，代码的运行结果正如我们所期望的那样。

箭头函数的使用大概有以下几种类型：

```javascript
"use strict";

let languages = ["Spanish", "French", "Italian", "German", "Polish"];

// 在多行箭头函数中，你必须使用花括号，
//  并且你必须包含一个return语句
let languages_lower = languages.map((language) => {
    return language.toLowerCase()
});

// 如果是单行的箭头函数，那么花括号则是可选的
//  并且函数会隐式的返回表达式，
//  你可以显示的提供return语句
let languages_lower = languages.map((language) => language.toLowerCase());


// 如果你的箭头函数只爆款一个参数，
//  此时，你可以不使用小括号去包裹参数
let languages_lower = languages.map(language => language.toLowerCase());


// 如果你的函数接收多个参数，你必须使用小括号包裹住它们
let languages_lower = languages.map((language, unused_param) => language.toLowerCase());

console.log(languages_lower); // ["spanish", "french", "italian", "german", "polish"]

// 最后，如果你的函数不接收参数，你也必须使用一个空括号
(() => alert("Hello!"))();

```

更详细单内容，我推荐你参考[MDN的文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)。

## References

1. [Better Node with ES6, Pt. I](https://scotch.io/tutorials/better-node-with-es6-pt-i)
2. [this All Makes Sense Now!](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20&%20object%20prototypes/ch2.md)