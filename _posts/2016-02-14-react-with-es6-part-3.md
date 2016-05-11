---
layout: post
title: 使用ES6编写React应用（3）：React类中方法的绑定
category: knowledge
---

本文是使用ES6来编写React应用系列的第三篇，本文主要将讨论的是React类中方法的绑定问题。
本篇博文的主要目的是解决前一篇文章中的遗留问题。

<!--more-->

## Statement

- **作者：** [景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。
- **源码：** 本文的源代码地址：https://github.com/wwsun/react-es6-tutorial

## 介绍

如果你阅读并尝试过[前一篇文章](http://wwsun.github.io/posts/react-with-es6-part-2.html)中的**`CartItem`组件的render方法**，
你可能会对其中使用`{this.increaseQty.bind(this)}`这样的语句感到困惑。
我们的直觉是直接使用`<button onClick={this.increaseQty} className="button success">+</button>`这样的代码。
如果你真的尝试这么做了，我们将会在浏览器的控制台中看到这样的一条错误：

    Uncaught TypeError: Cannot read property 'setState' of undefined
    
如下图所示：

![TypeError](http://7xpv9g.com1.z0.glb.clouddn.com/imgtype-error.JPG)

这是因为如果我们使用这种方式调用函数的话，此时的`this`并没有绑定到类本身，而是`undefined`。
这是JavaScript的默认行为。相反，如果你使用`React.createClass()`来创建组件的话，
所有的方法都会被自动绑定到对象的实例上。对一些开发者而言，这可能有点反直觉。

之所以没有使用自动绑定，是因为React开发组在决定实现组件对ES6类的支持时决定的。
如果你想了解更详细的原因，你可以通过[这篇博文](http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding)了解更多。

下面我们来进一步的讨论，如果你使用的是ES6类的话，如何在JSX中使用不同的方式调用类方法。

## 方法1：使用`Function.prototype.bind()`

这也就是我们已经在前一篇博文中使用过的方法：

```javascript
class CartItem extends React.Component {
  render() {
    <button onClick={this.increaseQty.bind(this)} className="button success">+</button>
  }
}
```

由于ES6类中的任何一个方法都是普通的JavaScript函数，它从Function原型中继承了`bind()`方法。
因此如果我们需要在JSX中调用`increaseQty()`，`this`将会指向我们的类实例。
你可以从[MDN文章](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)中获取更多的有关`Function.prototype.bind()`方法的内容。

## 方法2：在构造器中使用被定义的函数

我们还可以通过在类的构造器中解决函数绑定的问题，代码如下：

```javascript
class CartItem extends React.Component {
    
    constructor(props) {
        super(props);
        this.increaseQty = this.increaseQty.bind(this);
    }

    render() {
        <button onClick={this.increaseQty} className="button success">+</button>
    }
}

```

这样，你就无需在JSX中再使用`bind()`方法了，但这种方法的缺点是增加了构造器的代码，并且让构造器不再优美。

### 方法3：使用胖箭头函数`=>`和构造器

ES6胖箭头函数会在它们被调用的时候自动保存`this`上下文。我们可以通过这个特性来重新构造器中定义`increaseQty()`：

```javascript
class CartItem extends React.Component {
    
    constructor(props) {
        super(props);
        this._increaseQty = () => this.increaseQty();
    }

    render() {
        <button onClick={this._increaseQty} className="button success">+</button>
    }
}
```

### 方法4: 组合使用胖箭头函数和ES7类属性（附加）

首先，要声明一点，这里所谓的ES7只是一种统称，用于指代那些已经处于`stage-0`阶段的ES特性。
让我们来看看，ES7的类属性能够带来怎样的代码变化。

```jsx
class CartItem extends React.Component {
    
    increaseQty = () => this.increaseQty(); // 相当于直接声明函数表达式
    
    render() {
        return (<button onClick={this.increaseQty} className="button success">+</button>);
    }
    
}
```

我们发现，我们可以利用类属性来避免在构造器中映入方法的绑定代码。
要想使用上面的代码，你需要在Babel的配置选项中加入`stage-0`。

### 方法5: 使用ES7函数绑定语法

在ES的后续版本中，还会引入一个称为函数绑定操作符`::`，事实上，它不过是`Function.propotype.bind()`的一种语法糖。
在这里，我们并不深入探讨这个操作符的实现原理，我们只要知道可以如何用在我们的项目中，
幸运的是，Babel已经提供了对这个新语法的支持。

```jsx
class CartItem extends React.Component {
    
    constructor (props) {
        super(props);
        // this.increaseQty = ::this.increaseQty;  // 类似的，你也可以在这里绑定
    }
    
    render () {
        
        return (<button onClick={::this.increaseQty} className="button success">+</button>);
    }
}
```

最后，再次声明，所有本文所谓的ES7语法只是建议中的新的语法特性，并不一定会被纳入最终的ES标准中，
在实际的项目开发中需要谨慎使用。

## 小结

在本文中，我们主要讨论几种使用ES6代码来解决绑定到React组件方法的可行方案。
总体而言，由于JavaScript语言的自身特性，我们很难有一个统一的优雅的解决方案，
因此，我更偏向于使用第一种方法，在JSX中进行手动绑定。当然，在未来，ECMAScript标准将有更加优雅的解决方案。
如果你感兴趣的话，可以阅读[这篇文章](http://egorsmirnov.me/2015/08/16/react-and-es6-part3.html)。

## References

1. [About autobinding in official React blog](http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding)
2. [Auto binding, React and ES6 Classes](http://www.ian-thomas.net/autobinding-react-and-es6-classes/)
3. [Function Bind Syntax in Official Babel Blog](http://babeljs.io/blog/2015/05/14/function-bind/)
4. [Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
5. []()
6. [ECMAScript This-Binding Syntax](https://github.com/zenparsing/es-function-bind)