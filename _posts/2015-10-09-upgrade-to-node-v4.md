---
layout: post
title: 关于Node v4你必须知道几个ES6特性
category: technique
---

Node v4在9月9号正式发布了。这个版本是Node和iojs合并后发布的首个稳定版本，并且为开发者带来
了大量的ES6语言扩展。通过[这边文章](https://nodejs.org/en/docs/es6/)你可以大致了解
Node.js中包括的ES6语言扩展。本文将会为你介绍如何使用这些新特性。

<!--more-->

## 模板字符串

如果你想要在JavaScript中创建一个多行字符串，你可能曾经写过下面这样的代码：

	var message = [
		'The quick brown fox',
		'jumps over',
		'the lazy dog'
	].join('\n');

也许这种方法对于比较少的文本还是比较合适，但如果对于多行的长句子问题可能就变得一团糟了。
于是某个程序员写了个叫[multiline](https://github.com/sindresorhus/multiline)的库，
使用hack的方法来解决这个问题：

	var multiline = require('multiline');
	var message = multiline(function () {/*
			the quick brown fox
			jumps over
			the lazy dog
		*/});

幸运的是，我们现在可以使用ES6的[模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings)
来解决这个问题:

	var message = `
		The quick brown fox
		jumps over
		the lazy dog
	`;

此外，它还为我们带来了字符串插值（string interpolation）：

	var name = 'Weiwei';
	
	// 不需要这样做了 ...
	var message = 'Hello ' + name + ', how is your cat?';
	var message = ['Hello ', name, ', how is your cat?'].join('');
	var message = require('util').format('Hello %s, how is your cat?', name);
	
	// 使用新的方式 ...
	var message = `Hello ${name}, how is your cat?`;	

## 类

在ES5中定义类总会让人感觉到奇怪，并且需要足够的时间去适应这种写法。例如：

	var Pet = function (name) {
		this._name = name;
	};
	
	Pet.prototype.sayHello = function () {
		console.log('*scratch*');
	};
	
	Object.defineProperty(Pet.prototype, 'name', {
	get: function () {
		return this._name;
	}
	});
	
	
	var Cat = function (name) {
		Pet.call(this, name);
	};
	
	require('util').inherits(Cat, Pet);
	
	Cat.prototype.sayHello = function () {
		Pet.prototype.sayHello.call(this);
		console.log('miaaaauw');
	};
	
幸运的是，如今我们在Node中可以使用ES6的类语法了：

	class Pet {
		
		constructor(name) {
			this._name = name;	
		}	
		sayHello() {
			console.log('*scratch*');	
		}
		get name() {
			return this._name;	
		}
	}
	
	
	class Cat extends Pet {
		constructor(name) {
			super(name);	
		}	
		sayHello() {
			super.sayHello();
			console.log('miaaaauw');	
		}
	}

使用`extends`来实现类的继承，使用`constructor()`方法作为构造器方法，通过这样的方式来实现
子类对父类的继承。是不是很棒？还有更多的内容，可以参考[MDM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)。

## 箭头函数

函数调用中的`this`关键字的动态绑定总是会让人感到困惑，为此，开发人员也试图用不同的方法来解决
这个问题：

	Cat.prototype.notifyListeners = function () {
		var self = this;
		this._listeners.forEach(function(listener) {
			self.notifyListener(listener);	
		});	
	};
	
或者

	Cat.prototype.notifyListeners = function () {
		this._listeners.forEach(function(listener) {
			self.notifyListener(listener);	
		}.bind(this));	
	};
	
而如今，在Node中你可以直接使用箭头函数了：

	Cat.prototype.notifyListeners = function () {
		this._listeners.forEach((listener) => {
			this.notifyListener(listener);	
		});
	}
	
点击链接查看关于[箭头函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
的更多内容。

## 对象字面量

> 字面量（或字面值）是源代码中用来描述固定值的记号（token），可能是一个数、
或者是一个字符串。

当你要使用对象字面量的时候，现在有一种更优雅简洁的方式了：

	var age = 10, name = 'Petsy', size = 32;
	
	// instead of this ...
	var cat = {
		age: age,
		name: name,
		size: size
	};
	
	// ... do this ...
	var cat = {
		age,
		name,
		size
	};
	
并且你也可以轻松的在你的[对象字面量里加入函数](https://github.com/lukehoban/es6features#enhanced-object-literals)了。

## Promises

现在，你不再需要像`bluebird`或者`Q`这样的第三方promise库了，你可以使用原生的[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。
原生Promise主要暴露了一下的API：

	var p1 = new Promise(function (resolve, reject) {});
	var p2 = Promise.resolve(20);
	var p3 = Promise.reject(new Error());
	var p4 = Promise.all(p1, p2);
	var p5 = Promise.race(p1, p2);
	
并且可以配合箭头函数像下面这样写代码：

	p1.then(() => {}).catch(() => {});

## 字符串方法

字符串方法也得到了增强，你现在可以使用新的字符串工具方法了：

	// replace `indexOf()` in a number of cases
	name.startsWith('a')
	name.endsWith('c');
	name.includes('b');
	
	// repeat the string three times
	name.repeat(3);
	
并且，现在字符串也能[更好的处理unicode的问题](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla#Additions_to_the_String_object)了。

## `let`和`const`

猜猜以下函数调用的返回值：

	var x = 20;
	(function () {
		if (x === 20) {
			var x = 30;
		}
		return x;
	}()); // -> undefined
	
什么？`undefined`。使用`let`来替换`var`，你将会得到你想要的结果：

	let x = 20;
	(function () {
		if (x === 20) {
			let x = 30;
		}
		return x;
	}()); // -> 20
	
解释一下原因：`var`是函数范围的，而`let`是代码块范围的（这也是大部分人期待的那样）。正因为此，你可以认为
`let`是一个新的`var`，用于取代`var`的缺陷。你可以从[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
获取关于let更多的内容。

福利：node现在也支持`const`关键字了，用于定义常量，避免你给一个常量赋予不同的值。

	var MY_CONST = 42; // no, no
	const MY_CONST = 42; // yes, yes
	
	MY_CONST = 10 // with const, this is no longer possible
	
## 总结

Node v4带来了相当多的ES6特性，我希望上面的7个理由能够激发你去升级和使用最新的Node版本。

当然，还有更多的语言特性（例如，maps/sets, symbols和generators等）。所以，我强烈建议你阅读一下
[overview of ES6 additions to Node v4](https://nodejs.org/en/docs/es6/)。快去升级吧。

## 参考资料

1. [ES6 on Node.js](https://nodejs.org/en/docs/es6/)
2. [Node.js v4.0.0 Documentation](https://nodejs.org/api/)
3. [API changes between v0.10 and v4](https://github.com/nodejs/node/wiki/API-changes-between-v0.10-and-v4)