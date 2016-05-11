---
layout: post
title: Lodash中十个常用的工具函数
category: technique
---

当你使用JavaScript进行编程的时候，你很可能需要经常重复写一些工具函数，尤其是处理字符串和对象。
即使ES6已经被标准化了，JavaScript开发者依然无法获得像Objective-C或Ruby那样多的语法糖。
因此，在JavaScript应用中仍然被重复的编写大量的工具函数。而本文将会为你带来的救星就是[Loadsh](https://lodash.com/)。

<!--more-->

本文将要介绍的是Loadash中的10个常用的工具函数，当然对于不同的工作，你很可能也会需要其他的工具函数，
本文仅作为一个入门Lodash的引子，完整的函数列表请参考Lodash的[API文档](https://lodash.com/docs)。
本文使用的Lodash版本是`3.10.1`。

## Statement

> 原文地址： http://colintoh.com/blog/lodash-10-javascript-utility-functions-stop-rewriting

### 循环N次

	// 1. Basic for loop.
	for(var i = 0; i < 5; i++) {
		// ....
	}
	
	// 2. Using Array's join and split methods
	Array.apply(null, Array(5)).forEach(function(){
		// ...
	});
	
	// Lodash
	_.times(5, function(){
		// ...
	});
	
`for`循环是一个常见的使用场景，但是它会引入附加变量污染作用域（scope）。
你可以组合使用数组和`apply`方法来避免直接使用for循环，这样也避免了作用域污染的问题。
但是，这种写法不够直观。Lodash总的`_.times`方法就非常的直观易用。

### 迭代数组并返回每一项中深度嵌套的属性

	// Fetch the name of the first pet from each owner
	var ownerArr = [{
		"owner": "Colin",
		"pets": [{"name":"dog1"}, {"name": "dog2"}]
	}, {
		"owner": "John",
		"pets": [{"name":"dog3"}, {"name": "dog4"}]
	}];
	
	// Array's map method.
	ownerArr.map(function(owner){
		return owner.pets[0].name;
	});
	
	// Lodash
	_.map(ownerArr, 'pets[0].name');
	
Lodash中的`map`方法和JavaScript中原生的数组方法非常的像，但它还是有非常有用的升级。
你可以通过一个字符串而不是回调函数来导航到深度嵌套的对象属性。

### 创建一个大小为N的数组，并且为他们添加相同的前缀

	// Create an array of length 6 and populate them with unique values. The value must be prefix with "ball_".
	// eg. [ball_0, ball_1, ball_2, ball_3, ball_4, ball_5]
	
	// Array's map method.
	Array.apply(null, Array(6)).map(function(item, index){
		return "ball_" + index;
	});
	
	
	// Lodash
	_.times(6, _.uniqueId.bind(null, 'ball_'));
	
从前面的例子中我们已经知道了`_.times`的作用。如果你将它和`_.uniqueId`方法组合使用，
我们可以获得一个更简洁的解决方案。如果你不想重复的声明上下文，Lodash也提供了一个可选方案。

**避免使用`.bind(null,...)`**

	// Lodash
	_.times(6, _.partial(_.uniqueId, 'ball_'));

`_.partial`方法完成的工作和原生的`bind()`方法很类似，除了它假设当前的上下文为`this`。
因此，没必要再额外的指定上下文参数。

### 深度克隆JavaScript对象

	var objA = {
		"name": "colin"
	}
	
	// Normal method? Too long. See Stackoverflow for solution: http://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript
	
	// Lodash
	var objB = _.cloneDeep(objA);
	objB === objA // false
	
深度克隆JavaScript对象是困难的，并且也没有什么简单的解决方案。你可以使用原生的解决方案：
`JSON.parse(JSON.stringify(objectToClone))`进行深度克隆。但是，这种方案仅在对象内部没有方法的时候才可行。

Lodash提供了`_.cloneDeep`方法来帮你简单的完成对象的深度克隆操作。当然，使用`_.clone`你还能灵活的指定克隆的深度。

### 在指定范围内获取一个随机值

	// Get a random number between 15 and 20.
	
	// Naive utility method
	function getRandomNumber(min, max){
		return Math.floor(Math.random() * (max - min)) + min;
	}
	
	getRandomNumber(15, 20);
	
	// Lodash
	_.random(15, 20);
	
Lodash中的`random`方法要比上面的原生方法更强大与灵活。你可以只传入一个参数作为最大值，
你也可以指定返回的结果为浮点数。

	_.random(20); // Return random number between 0 to 20
	_.random(15, 20, true); // Return random floating numbers between 15 and 20

### 扩展对象

	// Adding extend function to Object.prototype
	Object.prototype.extend = function(obj) {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				this[i] = obj[i];
			}
		}
	};
	
	var objA = {"name": "colin", "car": "suzuki"};
	var objB = {"name": "james", "age": 17};
	
	objA.extend(objB);
	objA; // {"name": "james", "age": 17, "car": "suzuki"};
	
	// Lodash
	_.assign(objA, objB);
	
`_.assign`方法也可以接收多个参数对象进行扩展。

	var objA = {"name": "colin", "car": "suzuki"};
	var objB = {"name": "james", "age": 17};
	var objC = {"pet": "dog"};
	
	// Lodash
	_.assign(objA, objB, objC)
	// {"name": "james", "car": "suzuki", "age": 17, "pet": "dog"}
	
### 去掉对象的某些属性

	// Naive method: Remove an array of keys from object
	Object.prototype.remove = function(arr) {
		var that = this;
		arr.forEach(function(key){
			delete(that[key]);
		});
	};
	
	var objA = {"name": "colin", "car": "suzuki", "age": 17};
	
	objA.remove(['car', 'age']);
	objA; // {"name": "colin"}
	
	// Lodash
	objA = _.omit(objA, ['car', 'age']); // {"name": "colin"}
	
原生的途径你只能传递数组作为参数。有时我们可能也想对字符串参数进行单个key的删除，甚至是传入一个比较器。

	var objA = {"name": "colin", "car": "suzuki", "age": 17};
	
	// Lodash
	objA = _.omit(objA, 'car'); // {"name": "colin", "age": 17};
	objA = _.omit(objA, _.isNumber); // {"name": "colin"};
	
你需要注意的是，`_.omit`方法会返回一个新的对象，而不会修改原来的对象。

### 从某个对象中选择部分属性组成新的对象

	// Naive method: Returning a new object with selected properties 
	Object.prototype.pick = function(arr) {
		var _this = this;
		var obj = {};
		arr.forEach(function(key){
			obj[key] = _this[key];
		});
	
		return obj;
	};
	
	var objA = {"name": "colin", "car": "suzuki", "age": 17};
	
	var objB = objA.pick(['car', 'age']);
	// {"car": "suzuki", "age": 17}
	
	// Lodash
	var objB = _.pick(objA, ['car', 'age']);
	// {"car": "suzuki", "age": 17}
	
`_.pick`方法与`_.omit`方法正好相反，它会从对象中选择指定的属性组装成新的对象。
和`_.omit`一样，`_.pick`也会返回新的对象，并且能够传入字符串、数组、比较器函数。

### 从列表中随机的选择列表项

	var luckyDraw = ["Colin", "John", "James", "Lily", "Mary"];
	
	function pickRandomPerson(luckyDraw){
		var index = Math.floor(Math.random() * (luckyDraw.length -1));
		return luckyDraw[index];
	}
	
	pickRandomPerson(luckyDraw); // John
	
	// Lodash
	_.sample(luckyDraw); // Colin
	
此外，你也可以指定随机返回元素的个数。

	var luckyDraw = ["Colin", "John", "James", "Lily", "Mary"];
	
	// Lodash - Getting 2 random item
	_.sample(luckyDraw, 2); // ['John','Lily']
	
### JSON.parse的错误处理

	// Using try-catch to handle the JSON.parse error
	function parse(str){
		try {
			return JSON.parse(str);
		}
	
		catch {
			return false;
		}
	}
	
	// With Lodash
	function parseLodash(str){
		return _.attempt(JSON.parse.bind(null, str));
	}
	
	parse('a'); // false
	parseLodash('a'); // Return an error object
	
	parse('{"name": "colin"}'); // Return {"name": "colin"}
	parseLodash('{"name": "colin"}'); // Return {"name": "colin"}
	
当你使用`JSON.parse`时，请记住一定要进行错误处理。如果没有即使得进行处理，
很可能成为巨大的安全隐患。永远都不要假设你接收到的一定是正确有效的JSON对象。
取代原生的使用`try...catch`进行错误处理，你可以使用`_.attempt`方法。
如果出错的话，它会返回一个`Error`对象。

## 小结

Lodash能够为你解决非常多小的细节问题，推荐你在JavaScript项目中使用它，它能让你的代码看起来更加的精简，
也更加的健壮，帮你避免很多重复的应用逻辑。此外，Lodash也迫使我们以函数式的方式来思考编程。
我们可以将应用切分为若干个小且专注的模块。这种模块化能够提高我们应用程序在测试时的代码覆盖率。