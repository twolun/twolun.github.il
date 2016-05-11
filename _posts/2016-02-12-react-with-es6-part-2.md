---
layout: post
title: 使用ES6编写React应用（2）：类组件的属性与状态
category: knowledge
---

构建React应用一个基础场景是在组件中进行状态的传递与管理，通常我们需要借助组件的状态和属性来进行数据传递。
因此作为本系列的第二篇，本文将介绍如何基于ES6在React的类组件中设置组件的属性与状态。

<!--more-->

## Statement

- **作者：** [景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。
- **源码：** 本文的源代码地址：https://github.com/wwsun/react-es6-tutorial

## 介绍

在本文中，我们将进一步的学习React应用构建的更进一步的知识，我们将会创建一个更复杂的React组件`CartItem`。
该组件将会展示一个简单的产品信息预览图，包括产品的图片、价格、数量，你可以通过点击按钮增加或减少产品的数量，
并且组件能够基于产品的数量和价格，自动计算总价。

本文所构建的应用的最终下过如下图所示：

![app preivew](http://7xpv9g.com1.z0.glb.clouddn.com/imgreact-with-es6-part2-preview.JPG)

### 组件状态

组件主要通过两种方式管理状态数据：最常见的是通过`this.props`接收输入数据，
组件还可以保持内部状态数据（通过`this.state`）。当一个组件的状态数据发生变化时，
视图层将会通过`render()`方法进行重新渲染。

关于如何区分组件的`props`和`state`，请参考这篇[官方文档](http://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html)。

## 应用构建

### 创建视图

视图主要引入了基础的样式，`home.html`文件的内容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>React.js with ES6</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/css/foundation.min.css">
</head>
<body>

<div id="react-app"></div>

<!--<script src="bundle.js"></script>-->
<script src="http://localhost:8080/bundle.js"></script>
</body>
</html>
```

上面我们通过CDN引入了[Foundation CSS](http://foundation.zurb.com/)的基础样式库，对于构建一个小型应用而言，这已经足够了。
此外`div.react-app`作为React应用的加载点。

### Root组件

首先是`root.jsx`：

```javascript
// src/component/root.jsx
import React from 'react';
import CartItem from './cart-item.jsx';

const order = {
  title: 'Fresh fruits package',
  image: 'http://7xpv9g.com1.z0.glb.clouddn.com/fruit-image.jpg',
  initialQty: 3,
  price: 8
};

class Root extends React.Component {
  render() {
    return <CartItem title={order.title}
                    image={order.image}
                    initalQty={order.initialQty}
                    price={order.price} />;
  }
}

export default Root;
```

我建议使用`root.jsx`文件作为React组件树的根组件，这样我们无需反复的修改应用的入口文件（即`main.jsx`），
在根组件中我们导入相关的子组件，并完成对组件树的拼装。

此外我们还在该组件中添加了应用的初始数据`order`，我们通过组件属性的方式将数据传递给子组件。

### CartItem组件

其次是`cart-item.jsx`：

```javascript
// src/components/cart-tem.jsx
import React from 'react';

class CartItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: props.initialQty,
      image: props.image,
      price: props.price,
      total: 0
    };
  }

  componentWillMount() {
    this.recalculateTotal();
  }

  increaseQty() {
    this.setState({ qty: this.state.qty + 1 }, this.recalculateTotal);
  }

  decreaseQty() {
    this.setState({ qty: this.state.qty - 1}, this.recalculateTotal);
  }

  recalculateTotal() {
    this.setState({ total: this.state.qty * this.props.price });
  }

  render() {
    // TBD
  }
}

export default CartItem;
```

- 首先，我们关注的是类的构造器`constructor(props)`，必须要在构造器的第一行首先调用`super(props)`，
其次是在构造器中使用实例属性`this.state`来设置初始组件的state，通过这种方式来替React代传统的`getInitialState()`生命周期方法。
- 其实，其他的组件生命周期方法都使用`componentWillMount()`方法这种方式进行声明，在该方法中进行**总价**的重新计算。
- 最后，`increaseQty()`和`decreaseQty()`方法分别用来响应用户在点击对应按钮时对数量的修改。
需要注意的是，我们还利用了`this.state()`方法的第二个参数（回调函数）用来重新计算**总价**。

> 在ES6中，当我们创建一个类的时候，类的定义中有一个`constructor`方法，这个方法控制着所有静态方法，
实际上，我们正是依据这个方法创建了一个新的函数；然后我们又创建一个对象并将它赋给这个函数的`prototype`属性。
为了使新创建的类集成所有的静态属性，我们需要让这个新的函数对象集成超类的函数对象；同样，
为了使新创建的类集成所有的实例方法，我们需要让新函数的`prototype`对象集成超类的`prototype`对象。

在ES6中，我们利用`extends`关键字来创建子类，子类可以继承父类的属性，有时我们会在子类中重新定义同名方法，
这样会覆盖掉我们继承的方法。但在某些情况下，如果你重新定义了一个方法，但有时你又想绕开这个方法去使用父类中的同名方法，
应该怎样做？

`super`是一个全新的关键字，它可以帮我们绕开我们子类中定义的属性，直接从子类的原型开始查找属性，
从而绕过我们覆盖到父类上的同名方法。在子类构造函数中，我们可以通过`super()`调用父类构造函数。

### CartItem组件的`render()`方法

现在我们需要做的是完善组件的`render()`方法，这里使用的是JSX,用来渲染组件的视图。

```javascript
  render() {
    return <aricle className="row large-4">
      <figure className="text-center">
        <p><img src={this.state.image} alt="image"/></p>
        <figcaption><h2>{this.state.title}</h2></figcaption>
      </figure>

      <p className="large-4 column"><strong>Quantity: {this.state.qty}</strong></p>

      <p className="large-4 column">
        <button onClick={this.increaseQty.bind(this)} className="button success">+</button>
        <button onClick={this.decreaseQty.bind(this)} className="button alert">-</button>
      </p>

      <p className="large-4 column"><strong>Price per item:</strong> ${this.state.price}</p>

      <h3 className="large-12 column text-center">Total: ${this.state.total}</h3>

    </aricle>
  }
```

在上面的代码中，可能最值得我们关注的是`<button onClick={this.increaseQty.bind(this)}>+</button>`，
为了调用组件中的`increaseQty()`方法，我们使用`bind()`进行绑定。之所以这么做，将在下一篇文章进行解释。

目前我们已经完成了一个简单的能够与用户进行交互的React组件。虽然这个例子非常的简单，
但是它能够非常直观的向你展示如何使用ES6编写React组件。我个人非常喜欢ES6这种书写方式。

### 默认属性值和属性类型

如果我们需要给`CartItem`组件添加一些值的验证和默认值，我们该怎么做？

幸运的是，React内置了这两项功能，被称为Default Props和Prop Types。
你可以通过[这篇文章](https://facebook.github.io/react/docs/reusable-components.html)来了解。

在`CartItem`类下面添加如下代码：

```javascript
CartItem.propTypes = {
  title: React.PropTypes.string.isRequired,
  price: React.PropTypes.number.isRequired,
  initialQty: React.PropTypes.number
};

CartItem.defaultProps = {
  title: 'Undefined Product',
  price: 0,
  initialQty: 0
};
```

现在，如果你将`title`属性的值设为数字的话，你将会在控制台中发现对应的警告信息，这就得益于React的属性验证机制。

## 小结

本节我们简要介绍了使用ES6编写React组件，以及组件间如何进行数据的传递，包括组件的属性（props）和状态（state）。

## 参考

1. [React and ES6, part 2](http://egorsmirnov.me/2015/06/14/react-and-es6-part2.html)
1. [ES6 Classes final](http://www.2ality.com/2015/02/es6-classes-final.html)
1. [Exploring ES6: Classes](http://exploringjs.com/es6/ch_classes.html)