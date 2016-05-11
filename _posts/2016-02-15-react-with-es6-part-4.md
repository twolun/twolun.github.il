---
layout: post
title: 使用ES6编写React应用（4）：使用高阶组件替代Mixins
category: knowledge
---

本文是使用ES6编写React应用的第4篇，我们将主要讨论如何使用高阶组件的方式取代传统的React Mixins。


<!--more-->

## Statement

- **作者：** [景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。
- **源码：** 本文的源代码地址：https://github.com/wwsun/react-es6-tutorial

## 介绍

当使用`React.createClass()`的时候，你可能会使用到所谓的Mixins。使用Mixins允许我们在我们的React组件中混入一些附加的功能。
这个概念并不是React所独有的，它也存在于普通的JS或其他语言的框架中。

如果是要使用ES6来编写React组件的话，我们将不建议你使用React的mixin机制了。
本文并不会深入的探讨为什么不建议使用mixin的原因。如果你感兴趣的话，你可以通过如下的链接查看相关的资料：

- [React官方有关在ES6中使用mixins的博文](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#mixins)
- [Mixins已死——Dan Abramov](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)

下面我们将主要关注的是具体的例子。

## 使用高阶组件替代Mixins

本文我们将继续使用之前的代码，并对代码做一定的修改。通过本文，我们将能够在页面中显示用户在当前页面停留的时间。

为什么能够更好的进行说明，我们将不会修改`CartItem`组件的代码。而是通过提供一些能够包裹`CartItem`组件的组件，
并通过一些额外的功能来“增强”`CartItem`组件。这样的组件我们称之为高阶组件（Higher-Order Component）。

这个概念听起来可能有点含义模糊，随着我们的深入，你将会理解的更透彻一点。

假设，我们有一个`IntervalEnhance`组件，我们在`CartItem`组件中导入它，并通过它来包裹原有的导出对象。

```javascript
// src/components/cart-item.jsx
import React from 'react';
import { IntervalEnhance } from "./interval-enhance.jsx"; // 1. 导入包裹组件

class CartItem extends React.Component {
  // component code here
}

export default IntervalEnhance(CartItem); // 2. 包裹原有的CartItem组件
```

现在我们将来编写这个`IntervalEnhance`组件。

```javascript
// src/components/interval-enhance.jsx
import React from 'react';

// 1
export let IntervalEnhance = ComponsedComponent => class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      seconds: 0 // 2
    };
  }

  // 3
  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  // 3
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState({
      seconds: this.state.seconds + 1000
    });
  }

  render() {
    
    // 4
    return <ComponsedComponent {...this.props} {...this.state} />;
  }
};
```

我们一一的来解释上面几处加注释的代码：

1. `ComposedComponent => class extends React.Component` - 这其实和定义返回类的函数一样。
其中`ComposedComponent`是我们想要“增强”的组件（在上面的代码中就是`CartItem`组件）。
通过使用`export let IntervalEnhance`我们可以导出整个函数为`IntervalEnhance`（也就是上面代码中的`CartItem`）。
2. 初始化组件的状态（state），设置`seconds`的值为0。
3. 组件的生命周期钩子函数，用于期待能够和暂停计数器。
4. 最重要的一个部分。这行代码将所有的`state`或`props`拿到我们的“增强器”组件中，然后转移到`CartItem`组件中。
通过这种方式，`CartItem`组件将能够访问到`this.state.seconds`属性。

最后一步是改变`CartItem`组件中的`render`方法。我们将直接向视图中输出`this.state.seconds`：

```javascript
import React from 'react';
import { IntervalEnhance } from "./interval-enhance.jsx";

class CartItem extends React.Component {
    // component code here
    
    render() {
        return <article className="row large-4">
                <!-- some other tags here -->                    
                <p className="large-12 column">
                    <strong>Time elapsed for interval: </strong>
                    {this.props.seconds} ms
                </p>    
            </article>;
        }
}
export default IntervalEnhance(CartItem);
```

现在我们可以浏览器中检查结果了，我们将在页面中看到一行文字，显示用户在当前页面停留的时间。

**注意：**所有这一切并没有改变`CartItem`组件的任何主体代码（除了`render`方法）！
这就是为什么高阶组件这么强大的原因！

## 装饰器*

此外，ECMAScript的未来标准中还将引入装饰器的概念，通过这种方法能够更优雅的解决Mixin的问题，
本文不对未标准化的特性做过多的介绍。不过，代码大致如下：

```javascript
import React from 'react';
import { IntervalEnhance } from "./interval-enhance";

@IntervalEnhance
export default class CartItem extends React.Component {
    // component code here
}
```

## `PureRenderMixin`呢？

如果你使用了诸如`PureRenderMixin`这样的mixins，那么酱油一些其他的方法来使用ES6将这种功能带到React组件中。
其中一种如下：

```javascript
class Foo extends React.Component {
   constructor(props) {
     super(props);
     this.shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);
   }
   render () {
     return <div>Helllo</div>
   }
}
```

## 小结

高阶组件非常的强大并且表达能力强。目前，它们使用非常广泛，并且可以作为古老的mixin语言的替代。

对于高阶组件的使用最出名的要属[Relay]()框架。Relay是Facebook发布的一个完全的基于React的框架。
你所编写的没一个组件都可以被包裹进Relay容器，它能够自动检索数据依赖，以及一些其他的事。
这非常的便捷，并且在你刚接触的时候会觉得很神奇。

## References

1. [About mixins in ES6 in official React blog](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#mixins)
1. [Mixins Are Dead. Long Live Composition by Dan Abramov](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)
1. [JSX Spread Attributes](https://facebook.github.io/react/docs/jsx-spread.html)
1. [Gist with PureRenderMixin in ES6](https://gist.github.com/ryanflorence/a93fd88d93cbf42d4d24)