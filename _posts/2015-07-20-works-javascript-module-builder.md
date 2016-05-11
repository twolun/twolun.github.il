---
title: JavaScript模块化构建器和加载器
category: works
icon: code-fork
tags: [JavaScript, CommonJS, Module, AST, Builder]
figures:
  - src: "/img/project/module-builder.png"
    height: 130
public: false
---

本项目为我在某司实习期间完成的一个小需求，主要分为两个部分：

- 模块化构建器：构建器用来分析源代码结构、获取模块的依赖字典、以及对模块进行标准化包装
- 模块加载器：实现一个浏览器端的模块Loader，使得构建后的模块能够在浏览器端运行起来

整个流程包括以下几个部分：

- 语法解析：将源代码（统一遵循CommonJS风格）解析为抽象语法树
- 依赖识别：对语法树进行遍历，找出其中的模块间依赖信息
- 模块包装：对模块名进行格式化，使其符合一定的模块命名标准并添加版本信息
- 代码生成：将修改后的语法树重新输出为代码

语法解析的基本原理可以参考[这篇文章](http://wwsun.github.io/posts/javascript-ast-tutorial.html),
加载器的原理可以参考我写过的[这篇文章](http://wwsun.github.io/posts/creating-javascript-modules-loader.html)。