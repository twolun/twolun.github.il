---
layout: post
title: 谈谈React的核心入门知识
category: technique
---

React是最近一段时间被讨论的最多的前端话题之一。本文就来谈一谈React的入门实践，
本文会涉及到React开发中的一些常用概念，并且提供一些笔者认为的最佳入门实践，仅供参考。

<!--more-->

首先值得注意的是，React并不是一个框架，它提供了一些新颖的概念、库、
和编程原则来让你能够同时在服务端和客户端编写快速、紧凑、漂亮的代码，
它能够让你方便快速的构建web应用的表现层（View）。

如果你准备使用React，那么可能会涉及到一些常用的概念或技术，包括：

- ES6 React
- 虚拟DOM（virtual DOM）
- 组件驱动开发（component-driven development）
- 不变性（immutability）
- 自上而下的渲染（top-down rendering）
- 渲染路径和优化
- 打包工具, ES6, 构建请求, debugging, 路由等
- 同构React（isomorphic React）

## 什么是React.js

### React.js不是一个框架

在整个Web应用的MVC架构中，你可以将React看作为视图层，并且它是一个**高效**的视图。
React提供了和以往不一样的方式来看待视图，它以组件开发为基础。对React应用而言，
你需要将你的页面分割为一个个的组件。也就是说，开发页面的过程编程了组件开发的过程，
而页面就是组件的拼装结果。

通过分割组件的方式，你能够控制页面的复杂性，通过组件的方式去封装复杂的页面或某个功能区块。
并且，组件是可以被复用的。你可以将这个过程想象为：用乐高积木去拼装不同的物体。
因而，我们称这种编程方式称为**组件驱动开发**。

React的另一大特点是其所拥有的虚拟DOM。通过虚拟DOM，页面渲染变得更加高效，并且，
DOM操纵也变得更加可控。基于这两点，React所构建的视图层具有强大的自上而下的页面渲染能力。

总结一下：React有两个主要特点：组件化和高效的虚拟DOM。但是为什么它这么被看好呢？
因为React更多的是一种概念层面的东西，而所提供的库是其次的。
也有很多其他遵从了这些思想的第三方实现。和每一个编程概念一样，
React有其独有的解决方案、工具和工具。这里我们并不会去深入的讨论这些内容，
而是关注React本身。

### Virtual DOM

为了跟踪模型层的变化，并且将其应用到DOM中（也就是渲染），我们需要关注两件重要的事：

1. 数据是什么时候改变的
2. 哪一个（些）DOM元素需要被更新

对（1）而言，React提供了一个观察者模型用于替代传统的脏检查（dirty checking）机制，
也就是说它会持续的检查模型的变化。
这也就是解释了为什么React不需要计算哪些元素发生了改变的原因，因为它能立即知道。
这个过程减少了计算量，并且能够让web应用的运行变得更平滑。但真正有趣的还在于：
**React是如何管理DOM操纵的**。

对于DOM改变（2）而言，React在内存中构建了DOM的树形表示，随着模型的变化，
它会计算出哪个DOM元素应该被改变。对浏览器而言，DOM操纵是比较耗费性能的，
因此我们更倾向于将这个操作变得最少化。因此，基于这个思路，
React视图尽可能少的触及到DOM元素。对于对象表示而言，
更少的DOM操纵意味着计算会更快，因此DOM改变也被尽可能的减少。

React在底层实现了一个`diffing`算法，该算法使用DOM的树形表示法，当某个
节点发生变化（标记为dirty）时它会重新计算整个子树，你会注意到你的模型发生
了改变，因为整个子树在之后会被重新渲染。关于该算法的详细分析可以参考[这篇
文章](http://snip.ly/ywCe#http://calendar.perfplanet.com/2013/diff/)。

![virtual dom](/img/posts/150809-react-js-vdom.png)

### 如何在服务端渲染

因为React在DOM表示时使用了一个虚拟（假的）DOM，因此借助于这种方式使得在服务端
渲染输出HTML称为可能（不借助于JSDom, PhantomJS等）。
React还能智能的识别出服务端渲染出来的页面标记，并在客户端只为这些标记添加事件处理器，
这对构建同构Web App非常有用。

有意思的是，React渲染出来的HTML标记都包含了`data-reactid`属性，
这有助于在React中追踪DOM节点。

### 一些阅读资料

1. [React’s diff algorithm](http://calendar.perfplanet.com/2013/diff/)
2. [The Secrets of React's virtual DOM](http://fluentconf.com/fluent2014/public/schedule/detail/32395)
3. [Why is React's concept of virtual DOM said to be more
performant than dirty model checking?](http://stackoverflow.com/questions/21109361/why-is-reacts-concept-of-virtual-dom-said-to-be-more-performant-than-dirty-mode)
4. [virtual-dom](https://github.com/Matt-Esch/virtual-dom)

## 组件驱动开发 Component-Driven Development

对于组件驱动开发而言，你在一个模板中是看不到整个网站（应用）的。使用这种新的开发思路，
在一开始你可能会碰到一些苦难，但是如果能够深入的实践下去，应用开发将变得更加易于理解、
易于维护、并且更容易被测试。

### 如何使用React的方式来思考组件开发

下面我们来讨论如何实践组件驱动开发这一理念。首先看一个例子，这个例子来源于
[thinking in react](https://facebook.github.io/react/docs/thinking-in-react.html)
这篇文章。对于构建一个可过滤的产品列表而言，假设其包括如下的组件结构：

- FilterableProductTable 容器
	- SearchBar 搜索栏
	- ProductTable 产品表
		- ProductCategoryRow 产品类别栏
		- ProductRow 产品行

![thinking is react demo](/img/posts/150809-react-example.png)

### 一个组件应该包含什么

理想状态下，我们应该遵守[单一责任原则](http://en.wikipedia.org/wiki/Single_responsibility_principle)
来设计组件。当你认为你的组件需要做更多事情的时候，你可以再考虑将其分割为更小的组件集合。

组件可以进行嵌套，也就是说，在你的组件中也可以使用到其他组件。
首先我们来看下试用ES5来开发一个React组件的基础代码：

	var HelloComponent = React.createClass({  
	    render: function() {
	        return <div>Hello {this.props.name}</div>;
	    }
	});
	
如果使用ES6，你的组件代码可以这样写：

	class HelloComponent extends React.Component {  
	  render() {
	    return <div>Hello {this.props.name}</div>;
	  }
	}

使用ES6，代码会变得更加清晰。
	
### JS和JSX

正如你所看到的，我们的组件是JS和HTML代码的混合，你可能会觉得这样做很糟糕，
因为MVC一直在教我们尽可能的隔离视图和控制逻辑。但是，通过代码混写，
我们能够达到另一种层面的单一责任，因为它能让你的组件变得更加灵活和可重用。

当然，在React中你也可以使用纯JS来编写你的组件：

	render () {
	    return React.createElement("div", null, "Hello ",
	        this.props.name);
	}
	
是的，你会发现这很麻烦，没有使用HTML来得直观。因此React提供了JSX
(JavaScript eXtension)语法让你能够在JS中书写HTML标记。

	render () {
	    return <div>Hello {this.props.name}</div>;
	}
	
### 什么是JSX

[JSX](http://facebook.github.io/jsx/)在ECMAScript的基础上提供了类似于XML的扩展。
JSX和HTML有点像，但也有不一样的地方。例如，HTML中的`class`属性在JSX中为`className`。
其他不一样的地方，你可以参考FB的[HTML Tags vs. React Components](https://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components)这篇文章。

显然，浏览器原生并不支持JSX，因此我们需要某种手段将其转换为JS代码，
有很多工具能够帮你完成这个任务，后面我们会有介绍。一个流行的选择是使用Babel，
它能够将JSX转换为JS代码。

一些参考资料：

1. [JSX in depth](https://facebook.github.io/react/docs/jsx-in-depth.html)
2. [Online JSX compiler](https://facebook.github.io/react/jsx-compiler.html)
3. [Babel: How to use the react transformer](http://babeljs.io/docs/usage/transformers/other/react/)

### 组件还应该包括什么

组件还应该包括一些内部状态，处理逻辑，和事件处理器（例如按钮点击、输入改变）等，
当然也包括一些内部的样式。

你会遇到`{this.props.name}`这样的代码片段，这意味着你可以通过属性的方式向组件内传递数据，
例如`<MyComp name='weiwei sun' />`。这让组件变得可重用，
并且能够自上而下的向嵌套的组件传递数据。

示例代码如下：

	class UserName extends React.Component {  
	  render() {
	    return <div>name: {this.props.name}</div>;
	  }
	}
	
	class User extends React.Component {  
	  render() {
	    return <div>
	        <h1>City: {this.props.user.city}</h1>
	        <UserName name={this.props.user.name} />
	      </div>;
	  }
	}
	
	var user = { name: 'Sun', city: 'Nanjing' };  
	React.render(<User user={user} />, document.body);
		
### React拥抱ES6

在React中尝试编写ES6是个非常不错的开始，React并不是一开始就支持ES6的，
而是从`v0.13.0`开始支持的。你可能会经常用到的ES6特性包括类、箭头函数、const和模块。
例如，我们会经常从继承`React.Component`类开始编写我们的组件。

还有一点需要注意的是，并不是每个浏览器都支持ES6，因此目前情况下，
我们需要使用一些工具将我们编写的ES6代码转换为ES5代码，
我推荐使用[Babel](http://babeljs.io/)。

一些参考资料：

1. [Babel: Learn ES6](https://babeljs.io/docs/learn-es6/)
2. [React ES6 announcement](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html)

## 组件生命周期

每个React组件在加载时都有特定的生命周期，在此期间不同的方法会被执行。
下面简单介绍React组件的生命周期，详细内容请参考[官方文档](https://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)。

### Mounting: `componentWillMount`

服务端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用`setState()`，
`render()`将会感知到更新后的state，尽管state发生了变化，也只执行一次。

### Mounting: `componentDidMount`

在初始化渲染执行之后立刻调用一次，仅客户端有效（服务端不会调用）。对于整个生命周期而言，
你可以在该阶段访问到任意子节点的引用（refs）。此外，子组件的`componentDidMount()`方法在父组件之前先调用。

此外，如果你想要与其他的JavaScript框架集成，使用`setTimeout`或`setInterval`设置计时器，
或者是发送AJAX请求，在该方法中执行这些操作。

### Updating: `componentWillReceiveProps`

当组件接收到新的props时该方法被调用。该方法并不会在初始化渲染阶段被调用。

### Updating: `shouldComponentUpdate`

当组件接收到新的props或者state时，在渲染之前该方法被执行。
该方法并不会在初始化渲染阶段或者是强制使用`forceUpdate`阶段对调用。

[详细资料](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate)

### Updating: `componentWillUpdate`

在组件接收到新的props或者state但还没有render时被执行。
在初始化时不会被执行。

### `componentDidUpdate`

在组件完成更新后立即执行。在初始化时不会被执行。
一般会在组件完成更新后被使用。

### `componentWillUnMount`

在组件从DOM中unmount后立即执行。该方法主要用来执行一些必要的清理任务。

关于生命周期的具体内容，你可以参考[官方文档](http://facebook.github.io/react/docs/component-specs.html)。

## 在打包时使用Webpack和Babel

在开发时，我们会经常用到一些工具。最常用到的是是`Node.js`的模块系统和它的包管理工具`NPM`。
在React应用开发中，我们通常会用Node风格的`require`语句来引入我们需要的NPM模块。值得一提的是，
React本身也是一个独立的NPM模块。

在模块化方面，你通常会有两种选择，CommonJS或者ES6：

	var React = require('react/addon');
	
	var MyComponent = React.createClass({
		// do something
	});
	
	module.exports = MyComponent;
	
或者

	import React from 'react/addons';
	class MyComponent extends React.Component {
		// do something use es6
	}
	export default MyComponent;
	
其他方面，我们还会使用[debug](https://www.npmjs.com/package/debug)模块来调试，
使用[superagent](https://www.npmjs.com/package/superagent)模块来编写请求。

现在，我们有了Node的依赖管理系统，并且使用`npm`来提供模块。下面我们需要做的
事：选择一个合适的工具来打包我们的代码，并且能够让其运行在浏览器上。

因此我们还需要一个打包器。目前最流行的解决方案包括两个，分别是[Browserify](http://browserify.org/)和
[Webpack](http://webpack.github.io/)。我们选择使用Webpack，因为Webpack更适合于React社区。

### Webpack是如何工作的

Webpack用于打包我们的代码，并且包含进我们需要的包，然后输出为浏览器可运行的文件。
因为我们使用`JSX`和`ES6`，因此我们需要相应的工具来将其转换为ES5。事实上,
Babel能够同时做这两件事。使用Webpack能够很轻松的完成这些任务，因为Webpack是面向配置的。

使用如下命令开始：

	npm init
	npm install webpack --save-dev
	npm install babel --save-dev
	npm install babel-loader --save-dev
	
然后创建`webpack.config.js`文件，我们需要使用ES5来编写该文件，因为它是
webpack的配置文件。一个典型的配置方式如下：

	var path = require('path');
	
	module.exports = {  
	  entry: path.resolve(__dirname, '../src/client/scripts/client.js'),
	  output: {
	    path: path.resolve(__d irname, '../dist'),
	    filename: 'bundle.js'
	  },
	
	  module: {
	    loaders: [
	      {
	        test: /src\/.+.js$/,
	        exclude: /node_modules/,
	        loader: 'babel'
	      }
	    ]
	  }
	};
	
运行`webpack`命令你可以执行打包流程。这之后你可以只在页面中包含`bundle.js`即可。
如下：

	<script src='bundle.js'></script>
	
> 提示：你可以使用`node-static`来存放你的静态资源文件，使用`npm install -g node-static`
来安装，并使用`static .`来启动。

### 项目结构

一个典型的项目结构你可以参考[这个仓库](https://github.com/wwsun/starter-node-react)。
我推荐你使用这个仓库来启动一个新React项目，它提供了一个典型react-app的目录结构。

	config/  
	    app.js
	    webpack.js (js config over json -> flexible)
	src/  
	  app/ (the React app: runs on server and client too)
	    components/
	      __tests__ (Jest test folder)
	      AppRoot.jsx
	      Cart.jsx
	      Item.jsx
	    index.js (just to export app)
	    app.js
	  client/  (only browser: attach app to DOM)
	    styles/
	    scripts/
	      client.js
	    index.html
	  server/
	    index.js
	    server.js
	.gitignore
	.jshintrc
	package.json  
	README.md


### 如何测试React组件

对于React组件的测试，这里推荐使用[Jest](https://facebook.github.io/jest/),
Jest也是由Facebook提供的测试框架，并且有很多强大的特性，但这里并会详细的
介绍它们。

关于Jest，我推荐你阅读和尝试来自Facebook的[Tutorial](https://facebook.github.io/jest/docs/tutorial-react.html#content)。

对于ES6代码的测试，你可以参考 [React ES6 Testing](https://github.com/facebook/jest/tree/master/examples/react-es6)。

## 小结

本文简单介绍了React的基础原理，一些相关的编程技术。后续还会整合一些资料谈一谈Flux和同构。

### Statement

原文地址：https://blog.risingstack.com/the-react-way-getting-started-tutorial/
有增删改。

## References

1. https://blog.risingstack.com/the-react-way-getting-started-tutorial/
2. https://github.com/RisingStack/react-way-getting-started
3. http://facebook.github.io/react/docs/component-specs.html
4. https://github.com/wwsun/starter-node-react