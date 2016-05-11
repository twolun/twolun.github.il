---
layout: post
title: 使用ES6编写React应用（1）：简介及环境配置
category: knowledge
---

React是一个能够实现简单优雅的组件化方案的库。借助React能够快速的构建组件化前端应用，并且将关注的重点集中在视图层。
此外，React拥抱ES6，本文将会介绍如何使用ES6来编写React应用。作为本系列的第一篇文章，本文将主要讲诉相关的开发环境配置。

<!--more-->

## Statement

- **作者：** [景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。

在[之前的文章](http://wwsun.github.io/posts/react-getting-started.html)中，我们曾经讨论过React开发的基础知识，
如果你对React还不是很了解，可以参考该篇博文。另一方面，ES6已经在去年的年中正式被标准化，并且React拥抱ES6，对于开发者而言，
应该尽可能的使用ES6来编写React应用。因此，以本文为开端，大致的介绍如何使用ES6来编写React应用。

## 源代码

阅读本系列文章时可以参考[Github仓库](https://github.com/wwsun/react-es6-tutorial)中的代码。

## 工具说明

本文所使用的各项技术均为最新版本，具体的版本信息参考如下：

- Babel v6
- Node v4
- Koa v1
- React v0.14 (`react` and `react-dom`)
- Webpack v1.12

Babel是一个通用的多用途JavaScript编译器，借助Babel你可以将ES6甚至ES7代码转译为绝大部分浏览器都能执行的ES5代码，
此外Babel也能够用于转译React代码，并且这也是React官方所推荐的。
更多内容请参考[Babel用户手册](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md#babel-register)。

Webpack 非常容易操作，它是一个模块合并的工具，本质就是一个能够把各种组件（HTML，CSS，JS）构建成项目。
最方便的是你只需要初始化配置一次，Webpack 会替你做那些繁琐的事情，同时也保证了让你可以在项目中混合使用各种技术而不头疼。

Webpack能够通过配置取出代码中的依赖，然后通过加载器将代码兼容地输出为浏览器兼容的静态资源。
更多内容请参考[Webpack How-To](https://github.com/petehunt/webpack-howto/blob/master/README-zh.md)。

## 项目结构

本文所使用的项目结构如下：

    + build     客户端代码的构建结果目录
    + config    配置信息目录
    + lib       服务端库文件
        - render.js 渲染脚本
    + src       客户端源代码存放目录
    + test      测试文件目录
    + views     视图文件目录
    - index.js  服务器脚本

## 准备开发环境

### 构建一个简单的Koa服务器

为了能够让我们所构建的应用正常的运行和调试，首先需要做的是构建一个基本的Web容器，幸运的是，
我们可以基于Node.js快速的构建一个简单的并且满足需求的Web服务器。为了简单起见，我们选择使用Koa进行构建。

1. 使用`npm init --yes`快速的生成项目的初始文件。
2. 安装服务器端的相关依赖，如下：
    - koa
    - koa-logger
    - koa-route
    - koa-static
    - co-views
    - swig
3. 由于我们也想用ES6开发服务端代码，因此我们打算使用Babel动态编译代码，安装相关依赖：
    - babel-cli
    - babel-preset-es2015-node5
4. 在`package.json`中增加`babel`和`scripts`配置项：

        "babel": {
            "presets": [
            "es2015-node5"
            ]
        },
        "scripts": {
            "start": "babel-node index.js"
        }

服务器端代码的相关依赖和配置信息都已经完成了，现在只需要用ES6来开发一个简单的koa服务器即可：

```javascript
// index.js
'use strict';

import path from 'path';
import koa from 'koa';
import logger from 'koa-logger';
import serve from 'koa-static';
import route from 'koa-route';

import render from './lib/render';

var app = koa();

app.use(logger());
app.use(route.get('/', home));

function *home() {
  this.body = yield render('home', {});
}

app.use(serve(path.join(__dirname, 'build')));

app.listen(3000);
console.log('listening on port 3000');
```

由于服务器需要渲染基本的视图文件，因此我们可以借助`co-views`和`swig`编写一个简单的服务器端渲染脚本：

```javascript
// lib/render.js
'use strict';

import path from 'path';
import views from 'co-views';

export default views(path.join(__dirname, '../views/'), {
  map: {html: 'swig'}
});
```

创建视图文件`views/home.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>React.js with ES6</title>
</head>
<body>

<div id="react-app"></div>

<!--<script src="bundle.js"></script>-->
<script src="http://localhost:8080/bundle.js"></script>
</body>
</html>
```

### 配置Webpack

由于我们需要使用ES6来编写React应用，因此我们需要将React代码编译为普通的JS代码，幸运的是，
我们可以借助Webpack和Babel来完成这项任务。

我们建议你不要全局安装Webpack，而是将`webpack`作为项目的开发依赖（`devDependencies`），
这样你就可以在`package.json`的`scripts`配置项中直接使用`webpack`命令，而无需在新的环境中全局安装Webpack。

Webpack的配置步骤如下：

1. 使用`npm i PACK_NAME --save-dev`安装Webpack，包括如下开发依赖：
    - webpack
    - webpack-dev-server
2. 安装Babel相关依赖，用于编译React代码：
    - babel-loader
    - babel-preset-es2015
    - bebel-preset-react
3. 创建Webpack配置文件：`config/webpack.config.js`
4. 在`package.json`文件中添加编译React代码相关的`scripts`脚本：

        "scripts": {
            "start": "babel-node index.js",
            "build": "webpack --config config/webpack.config.js",
            "watch": "webpack-dev-server --config config/webpack.config.js --hot --inline --progress"
        },

> `npm`是一个非常好用的用来编译指令，通过`npm`你可以不用去担心项目中使用了什么技术，你只要调用这个指令就可以了，
你只需要在`package.json`中设置`scripts`的值就可以了。例如，上面的例子中，
我们可以通过`npm run build`来运行webpack执行构建工作。

如果每次源代码发生了变化，就执行`npm run build`来重新编译的话，的确是一件非常无聊的事情，幸运的是，
我们可以让他安静的运行，这就是我们为什么要引入[webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)的原因。
简单解释一下可能会涉及到的相关命令：

- `webpack-dev-server` - 在`http://localhost:8080`建立一个Web服务器，用来存放每次编译后的静态资源包
- `--hot` - 模块热加载，建议与`--inline`一起使用。
- `--inline` - 将webpack-dev-server的运行时（Runtime）嵌入到bundle中
- `--devtool eval` - 为你的代码创建源地址。当有任何报错的时候你可以更加精确的定位到文件和行号
- `--progress` - 显示合并代码的进度
- `--colors` - 命令行中显示颜色
- `--content-base OUTPUT_FOLDER_NAME` - 指向设置的输出目录

Webpack的配置文件如下：

```javascript
// config/webpack.config.js
var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, '../node_modules');

var dir_src = path.resolve(__dirname, '../src');
var dir_build = path.resolve(__dirname, '../build');

module.exports = {
  entry: path.resolve(dir_src, 'main.jsx'),
  output: {
    path: dir_build, // for standalone building
    filename: 'bundle.js'
  },
  // webpack-dev-server默认配置项，建议使用
  devServer: {
    contentBase: dir_build
  },
  module: {
    loaders: [
      {test: /src(\\|\/).+\.jsx?$/, exclude: /node_modules/, loader: 'babel', query: {presets: ['es2015', 'react']}}
    ]
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    colors: true // Nice colored output
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map'
};
```

该文件是一个标准的Node.js模块，并暴露出一个配置信息的对象。主要包括如下选项：

- `entry`：Webpack解析模块的入口文件（即以该文件如入口，深度遍历项目的所有的依赖项，从而执行模块构建任务）
- `output`: webpack将入口文件和它的所有依赖项进行打包，命名为`bundle.js`输出到目标目录中
- `module.loaders`: 导入文件的预处理器
- `plugins`: 用于扩展webpack的插件
- `devtool`: 开启devtool，并配置输出代码的source map
- `devServer`: 告诉webpack-dev-server需要服务的文件

通过上面的配置，我们已经可以编写ES6代码了。

## 编写React应用

为了能够使用React来编写应用，我们需要安装React的相关依赖，从0.14开始，React被拆分为了两个包（react和react-dom），
因此你首先需要安装这两个依赖：`npm install react react-dom --save-dev`。安装好依赖包后，便可以借助React来编写应用了：

### 根组件： `root.jsx`

React应用组件树的根文件：

```javascript
// src/components/root.jsx
import React from 'react';

class Root extends React.Component {
  render() {
    return <h1>Hello from {this.props.phrase}!</h1>;
  }
}

export default Root;
```


### 入口： `main.jsx`

然后我们需要编写React应用的入口文件，通常命名为`main.jsx`：

```javascript
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root.jsx';

let attachElement = document.getElementById('react-app');

ReactDOM.render(<Root phrase="ES6"/>, attachElement); // 实例化根组件，并启动应用
```

- `ReactDOM.render()` 实例化根组件，启动框架，并且将标记注入原始的DOM元素中（参数2）。
- `ReactDOM`模块主要暴露了和DOM相关的方法。

### 组件的命名规则

这里我建议使用JavaScript的常用命名规则，即：

- 对于文件名，多个单词使用`-`分隔，单词均使用小写，例如`hello-world.jsx`。
- 对于组件名，名称与文件名相同，但使用Java的大驼峰的类名规则，例如`HelloWorld`。

## 测试及启动

1. 使用`npm run watch`启动`webpack-dev-server`
2. 使用`npm start`启动服务器
3. 打开浏览器访问`http://localhost:3000`查看结果

## 小结

本文简要介绍了如何使用ES6来进行React应用的开发，涉及到具体的开发环境的配置，包括借助webpack进行项目的模块打包构建，
以及使用Babel进行ES6代码的转译。在后续的文章中，将进一步的介绍React应用开发的高级技术，包括状态管理、路由等。

## 参考文件

1. [React and ES6, Part 1](http://egorsmirnov.me/2015/05/22/react-and-es6-part1.html)
1. [React and Webpack Cookbook](https://fakefish.github.io/react-webpack-cookbook/index.html)
1. [React - Getting Started](https://facebook.github.io/react/docs/getting-started.html)
1. [Setting Up Babel 6](http://babeljs.io/blog/2015/10/31/setting-up-babel-6/)
1. E-book: [Exploring ES6](https://leanpub.com/exploring-es6/)
1. [JSX in Depth](https://facebook.github.io/react/docs/jsx-in-depth.html)
1. [Babel Handbook](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)
1. [Webpack How-to](https://github.com/petehunt/webpack-howto/blob/master/README-zh.md)