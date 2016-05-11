---
layout: post
title: Relay——React数据获取框架
category: knowledge
---

React在前端领域开启了一个新的时代。随着Facebook发布并开源React，它迅速成为[大量技术公司](https://github.com/facebook/react/wiki/Sites-Using-React)
运用在生产环境中的一款流行的库。在本文中，我们将会讨论的是一个全新的React附属框架——Relay。

<!--more-->

## Statement

> 原文地址：http://www.sitepoint.com/react-data-fetching-with-relay/

## React中数据获取存在的问题

由于React正在变得越发流行，使用React构建的项目的规模和复杂度也随之增加。
由于React只是一个视图层的库，这使得某些团队需要在不同的基础设施上构建项目时会面临很多未知的问题和挑战。
基于这些痛点，Facebook也前瞻性的给予了很多技术支持和指导。

### Flux

对于使用React的开发者而言，早期的主要痛点之一是事件处理。为了解决这个问题，Facebook发布了Flux，
它是一种基于单向数据流思想来解决React中事件处理问题的设计模式（不是一个框架）。

我假设你已经对Flux有所了解了，因此本文不会具体的去讨论Flux。假如你对Flux并不了解，可以参考下面两篇文章：

1. [使用React和Flux来构建一个记事APP](http://www.sitepoint.com/creating-note-taking-app-react-flux/)
2. [Flux: 一种为React打造的应用程序架构](https://facebook.github.io/react/blog/2014/05/06/flux.html)

Flux将React生态系统带到了一个更高的层级。即使这样，当开发者开始使用并熟悉Flux时，一些新的问题又出现了。
Flux适合用于管理作为应用程序状态的数据，但是如何将初始状态传递进应用程序成为了又一个问题之源。

围绕着Flux的数据初始化面临着许多的挑战。在Store中向服务器发起请求并传递给自身？在dispatcher中使用rehydrate方法？
在服务器上调用一组actions来传递到store？对于同构应用而言，如何在返回响应前完成数据的异步加载？

## 什么是Relay

[Relay](https://facebook.github.io/relay/)是Facebook发布的一个全新的React数据获取框架。
Relay致力于为所有上述这些数据获取问题提供清晰的解决方案。

Relay主要有以下几个特点：

- 描述性 Declarative：这也是React的主要特点之一，对于数据依赖，Relay使用了描述性的代码风格定义，
这非常类似于在React中定义视图层组件的方式。这也是和传统的命令式的数据获取API主要不同的地方。
- 托管 Colocation：数据依赖的定义始终伴随着组件的定义。这使得能够非常简单的推出UI组件需要渲染哪些数据。
这使得解决项目中的代码问题变得非常简单。只需检查一个文件中包含的React组件定义，就能立刻知道函数所需要的数据是什么。
- 变种 Mutations：它使得无缝的数据修改称为可能，也就是说React视图层会订阅数据，并且能够会将修改传播到数据持久化层。

### Relay vs Flux

Flux是一个抽象的概念，而Relay是基于这个抽象概念的实现。Relay是建立在Flux的概念基础上，
因此也有和Flux中相同的概念，例如dispatcher，actions，和stores，但它们代表的含义有所不同。
Relay有一个新的叫做“高阶组件”的概念，我们在本文的后面会继续讨论这个概念。

到现阶段为此，还不清楚Relay是否会替代（或并存）现存的Flux实现。
例如，[Redux](https://github.com/rackt/redux)，它是一个非常流行的Flux实现，
同样也使用了“高阶组件”的概念。如果你尝试同时使用Redux和Relay，会遇到具体由哪个框架绑定到UI组件上的冲突。
目前，你可以参与[Redux和Relay关系的讨论](https://facebook.github.io/react/blog/2014/05/06/flux.html)。

## 高阶组件

高级组件（Higher Order Compoenents, 简称HOC）的定义采用和普通的React组件相同的方式。
HOC组件会包裹将UI组件作为孩子包裹起来（称UI组件为子UI组件）。HOC组件会执行相关查询，
然后渲染子UI组件，并将查询数据作为`props`传递进UI组件。

现在Flux数据流由HOC组件管理，之后将会扮演dispatcher的角色。它具有一个类似于`setQueryParams()`的方法，
可以将其看作为Flux中的action。调用`setQueryParams()`将会触发Flux数据流。
定义在HOC组件中的查询被更新，新的数据被获取，并被持久化在HOC组件中。
通过持久化这些数据HOC组件也扮演者Flux中Store的角色。

下面来举个简单的例子来说明上面的描述：假设有一个`ProfilePicture`组件和一个对应的HOC组件。
其中`ProfilePicture`组件可以用来在我们的整个项目中渲染用户的头像。相应的，我们需要获取数据来展示用户头像。
因此我们可以借助Relay来创建一个HOC组件用于从数据库中查询用户的头像信息。
最后，由HOC组件将数据传递给子UI组件（即`ProfilePicture`组件）。

	class ProfilePicture extends React.Component {
		// A standard Profile Picture component	
	}
	
	// HOC: it fetches the data to pass as props to ProfilePicture
	module.exports = Relay.createContainer(ProfilePicture, {
		fragment: {
			user: () => Realy.QL `
				fragment on User {
					profilePicture(size: $size) {
						uri,	
					},	
				}
			`,
		}
	});

然后，我们的`ProfilePicture`组件会通过传递进来的props获得一些新的本地函数。
这就是Relay如何触发Flux数据流的基本原理。组件调用这些Relay的prop函数，就类似于调用Flux的action。
这可以让Relay去获取最新请求的数据，一旦数据获取完成便将其内部的store作为Props传递给HOC组件的子视图组件。

## GraphQL

上面的代码中可能有一部分比较陌生的地方，尤其是这部分代码：

	Relay.QL`
		fragment on User {
			profilePicture(size: $size) {
			uri,
			},
		}
		`,
		
在Relay背后绝大部分神奇的地方都是由GraphQL驱动的。GraphQL是Facebook开发的一种全新的的查询语言，
尤其擅长于查询图结构的数据。深入的讨论GraphQL不属于本文的范畴，你可以参考以下几篇文章来了解GraphQL：

1. [Relay和GraphQL简介](https://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html)
2. [Relay入门](https://facebook.github.io/relay/docs/getting-started.html#content)

现有的项目并不能直接与GraphQL集成，需要做相关的配置工作。首先你需要做的是：

1. 创建GraphQL的Schema
2. 创建一个GraphQL服务器

值得考虑的的是，对于已有的项目，如果想要改造项目以使用GraphQL模式可能会涉及到大量的修改工作，
你需要将现有服务器配置并修改为GraphQL友好的。因此，推荐你在启动一个新项目时尝试使用Relay，
为此，Facebook还提供了一个[Relay Starter Kit](https://github.com/relayjs/relay-starter-kit)
来帮助你快速的使用Relay和GraphQL启动一个新的项目。

## 没有GraphQL的Relay

由于设置GraphQL涉及到一些额外工作，因此Relay并不适合在现有项目中使用。幸运的是，受到Relay的启发，
有一个叫做react-transmit的库可以更好的适应现有项目。它是一个开源项目，
其宣传语就是“一个受Relay启发的，使用Promise代替GraphQL的开源库”。

我们可以用`react-transmit`来重写上面的例子，代码如下：

	// Import Transmit
	import Transmit from "react-transmit";
	
	class ProfilePicture extends React.Component {
		// A standard Profile Picture component
	}
	
	// This is our Higher Order Component. It fetches the data to pass
	// as props to Profile Picture
	Transmit.createContainer(ProfilePicture, {
		fragments: {
			user: (userId) => {
				return new Promise(function(resolve, reject) { 
					// Do some Ajax here and resolve the promise
				});
			}
		},
	});
	
使用`react-transmit`的例子看起来和Relay的例子非常的像。但是，代码中的`user`部分
现在返回的是Promise，而不是GraphQL查询。

## Relay的近况

Facebook已经发布并开源了[Relay的技术预览版](https://facebook.github.io/react/blog/2015/08/11/relay-technical-preview.html)。
在它的代码库中有一些非常不错的例子展示了如何使用Relay，并且有一个非常详尽的[文档](https://facebook.github.io/relay/)。

此刻对于Relay是否适合同构App还没有定论，因为暂时还没有方法能够告诉Relay，让它在渲染子视图之前，
先等待所有的数据依赖被加载完成，因此在服务器端需要做些事情。加入你对这个话题感兴趣，你可以参与
有关[Relay如何在服务端工作](https://github.com/facebook/relay/issues/136)的讨论。
在问题还没有解决之前，你可以尝试使用react-transmit来应对相关问题。

至于Relay的未来，它的路线图展示了它未来的几个关键特性：

- 适用于其他存储类型的是配置，不仅仅是图结构的数据。
- [更好的同构支持](https://github.com/facebook/relay/issues/136)，正如前面所提到的。

## 总结

在本文中，我们讨论一个新的被称为Relay的React附属框架。React基于和Flux同样的概念而构建，
并且由GraphQL驱动。正如我提到的，Relay可能并不适合用于一些现有项目。但是，这个框架非常的新，
期望它能够有越来越好的版本发布。