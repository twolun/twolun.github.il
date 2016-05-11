---
layout: post
title: 谈谈Babel v6的新特性及未来定位
category: technique
---

Babel 6刚发布不久，整个版本经历了彻底的重构和定位，目标是从一个单一的JavaScript转换器转向为一个JavaScript工具平台，
新的版本带来了很多全新的特性，并且在使用上也做出了很多重要的改变。本文翻译自Babel的官方博客，向你介绍Babel 6的定位、
特点、与使用方法。

<!--more-->

## Statement

- 原文地址： https://babeljs.io/blog/2015/10/29/6.0.0/
- **译者：**[景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。

## Babel 6

过去的一年发生了很多的事。我们（Babel）团队在世界各地旅行并与当地的社区探讨Babel，通过这种方式，
我们也认识了很多非常廖记不起的开发者和合作伙伴。

在过去的一年，Babel一直在探索自己在JavaScript社区的定位。因此在二月份的时候，我们做出了一个决定，
认为Babel不应该仅仅只是个ES6语法转换器，取而代之的，它应该成为一个平台，它应该包括一组精心设计的工具用于创建下一代JavaScript工具集。

当我们发布Babel 5的时候，它开放了一组新的插件API，允许任何人依赖Babel的全部功力来创建能直接插入转换过程的工具。
仅仅几个月的时间，它就形成了一个[完整的工具生态体系](https://www.npmjs.com/search?q=babel-plugin)。

从调试工具、框架优化和代码压缩到实验性的新语法和机制，开发者能够构建一切工具用于强化它们的代码库。
而这些扩展也已经被证明是非常有创造力并且极其有效的。

有的开发者也利用了Babel的内置组件（internals）来构建复杂的工具，例如 [documentationjs](http://documentation.js.org/) 
，它利用了Babel的Babylon解析器用于替代已有的工具，达到了一个更加智能的版本。

但是我们认为Babel可以走的更远。Babel有能力驱动代码压缩、代码规范（Linter）、代码格式化、语法高亮、代码完成工具、
类型检查、codemod工具等一系列功能，Babel能够让JavaScript社区朝着更好的方向发展。

因此，我们发布了Babel 6。

这应该有史以来Babel最重要的一次更新，因为它能让Babel更坚实的迈向平台化。

## 主要变化

### 模块化

模块化可能是Babel 6最大的一个变化，这个版本使用了尽可能模块化的方法进行了完整的重构，
通过设计统一的公共接口API，所有的转化器都进行了重构。

所有的内部组件都被抽取出来重构为单独的包，每个包都定义了一个轻量级的公共API，从而可以被其他组件所独立依赖。

如果你想使用某些Babel内部组件执行某种构建任务，现在，你只需要单独的去安装这个包，然后就能完成任务。
在[包目录](https://github.com/babel/babel/tree/development/packages)中你可以找到现存的所有的包和插件。

### 可选的插件

因为Babel现在的目标不仅仅是作为ES2015的转换器，而是作为一个JavaScript工具平台，因此我们决定让所有的插件都是可插拔的。
这就意味着，如果你现在直接安装Babel的最新版本，那么默认情况下它并没有用来转换ES2015的代码的功能，你需要安装相应的转换器插件。

为了能够彻底的简化Babel的公共API，现在每个转换器（transformer）都是彻底独立的。
这就意味着“blacklist”、“whitelist”、“optional”、“nonStandard”和“modules”选项都被移除了，
但这并不意味你如果你要通过Babel来转换代码会带来更多的工作。

### 插件预设

因为在配置文件中指定和维护大量的转化器信息可能会导致大量的工作，因此Babel 6引入了插件预设值的概念，
可以用于组织相似的插件用于简单的消费。例如：

	$ npm install --save-dev babel-preset-es2015
	
	{
		"presets": ["es2015"]	
	}

目前，官方的预设包括`babel-preset-es2015`和`babel-preset-react`，但是，我们希望未来能够有更多的预设插件。

我们也为不同的阶段提供了预设，例如`babel-preset-stage-0`（这和在Babel 5.x中在`.babelrc`中指定`stage: 0`的效果是一样的）。

### 性能改进

性能依然是Babel最为核心的指标之一。Babel 5彻底的革新了转换和遍历管道，用于提升和改进Babel的性能，这在Babel 6中依然被使用。

在Babel管道中，遍历过程是时间花费最主要的部分之一。使用任何的基于AST的工具你都希望能够尽可能快的完成对语法树的遍历。
Babel的插件也是按照这个方向进行设计的，因此它能够非常快的完成遍历工作。

Babel 6实现了一个新的优化方案，用于将所有的插件合并在一次遍历操作中。然后管理完整的遍历过程，因此插件无需再担忧这个过程。
作为一个开发者，你只需要关注业务逻辑，Babel会帮你处理其余的问题。

### 插件API

我们收到很多的反馈认为创建API让人迷惑，因此在Babel 6中，它变得更加简单了。注意这是个非常大的变化，但是它应该能够减少困惑。

*** Babel 5 ***

```javascript
export default function ( {Plugin, types: t} ) {
    return new Plugin('ast-transform', {
        visitor: { ... }
    });
}
```

*** Babel 6 ***

```javascript
export default function ( { types: t} ) {
    return {
        visitor: { ... }
    };
}
```
	
## 简单入门

### 安装Babel

需要注意的是，已经不再有`babel`包了。在这之前，`babel`包囊括了整个编译器、所有的转换器以及一个CLI工具，
这么做的缺点就是它会导致很多不必要的下载，并且代码也令人困惑。因此，现在我们将它分为两个单独的包：
`babel-cli`和`babel-core`。

	$ npm install --global babel-cli
	# or
	$ npm install --save-dev babel-core

如果你想要在命令行使用Babel，你可以安装`babel-cli`，或者你需要在一个Node项目中使用Babel，你可以使用`babel-core`。

我们希望你尽快将你的代码升级到Babel 6，这将成为未来的主流。

### 增加插件和预设值

默认情况下，Babel 6并没有携带任何转换器，因此如果对你的代码使用Babel的话，它将会原文输出你的代码，不会有任何的改变。

因此你需要根据你需要完成的任务来单独安装相应的插件。例如，如果你想使用箭向函数的话：

首先安装箭向函数插件：

	$ npm install --save-dev babel-plugin-transform-es2015-arrow-functions
	
然后在你的`.babelrc`文件中加入下面的代码：

	{
		"plugins": ["transform-es2015-arrow-functions"]
	}

现在如果你对一个使用了箭向函数的源代码文件使用Babel的话它将会被成功的编译。非常简单吧。

Babel插件被设计用来渐增的编译代码。假设你想使用ES2019的特性的话，那么代码首先被编译为ES2018，
然后是ES2017，直到编译为浏览器支持的版本。这允许了用户能够使用它们想要使用的原生实现。

这也对单一的标准有效，例如ES2015常数将会被编译到ES2015的`let`变量。因此，如果你需要使用ES2015的其他特性的话，
你也可以按照类似的方法安装相应的插件：

	$ npm install --save-dev babel-plugin-transform-es2015-constants
	$ npm install --save-dev babel-plugin-transform-es2015-block-scoping

然后是配置文件

	{
		"plugins": [
			"transform-es2015-constants",
			"transform-es2015-block-scoping"
		]
	}
	
当然手动配置这些单一特性非常的繁琐，这只适用于你仅仅使用了某几个ES2015的新特性，如果不是这种情况，
或者更一般的情况，你可以直接安装插件的预设，例如：

	$ npm install --save-dev babel-preset-es2015
	
在`.babelrc`中配置：

	{
		"presets": ["es2015"]
	}

当然我们也为React准备了一个预设：

	$ npm install --save-dev babel-preset-react
	
它的配置信息：

	{
		"presets": ["react"]
	}

## 最后

这对Babel而言是个非常令人激动的发布。

任何参与过开源项目的人都会体会到，这是一个非常艰巨的任务，涉及到非常多的工作，但最终到发布的时候，
需要非常的感谢整个社区的力量。我们非常激动的发布Babel 6，我们希望Babel在未来能够成为最好用的JavaScript工具，
所以赶紧来尝试最新的版本吧。