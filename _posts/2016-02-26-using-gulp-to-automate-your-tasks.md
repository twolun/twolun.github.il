---
layout: post
title: 使用Gulp.js来自动化你的任务
category: knowledge
---

作为开发者而言，我们需要经常确保自己使用了合适的开发工具来提高我们的开发效率。对于JavaScript的项目构建而言，
Chris开发了Grunt，它极大的便利了项目的构建工作。本文将会介绍一个比Grunt更优雅的项目构建工具——Gulp。

<!--more-->

## Statement

- **作者：** [景庄](http://wwsun.github.com)，Web开发者，主要关注JavaScript、Node.js、React、Docker等。

## Gulp.js

在几个月前，我[曾经介绍过Grunt](http://wwsun.github.io/posts/grunt-getting-started.html)，
今天将要介绍的是一个和Grunt类似的构建工具——Gulp。
Gulp和Grunt都是完全使用JavaScript实现的构建工具，不过，Gulp是一个流式构建系统，
它完全借助了Node的流文件操纵功能，在内存中完成构建工作。整个插件都是通过`pipe()`函数来赋予。

Gulp的最大特点在于流的使用，数据流能够同故宫一系列的小函数来传递数据，这些函数会对数据进行修改，
然后把修改后的数据传递给下一个函数。和Linux中的管道概念是一个意思。流可以相互链接。

注意，Gulp管道中的流不是操作Strings和Buffers的常规Node.js流，
而是启用[object mode](https://nodejs.org/dist/latest-v4.x/docs/api/stream.html#stream_object_mode)的流。
Gulp中的流发送的是vinyl文件对象。

有关Node中流的介绍，请参考[官方文档](https://nodejs.org/dist/latest-v4.x/docs/api/stream.html#stream_stream)。

## 安装Gulp

安装Gulp非常的简单，只要遵循下面三个步骤即可：

1. 全局安装Gulp
2. 安装Gulp到项目的`devDependencies`中
3. 在项目根目录创建`gulpfile.js`文件

    $ npm install -g gulp
    $ npm install --save-dev gulp

我们安装Gulp的工具插件用于可视化任务的执行过程：
    
    $ npm install --save-dev gulp-util
    
在项目根目录创建完`gulpfile.js`后，我们加入如下基础代码：

```javascript
// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util');

// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});
```

现在你可以通过`gulp`命令来启动Gulp。你可以在项目的`package.json`文件中的`scripts`属性中加入：

    "gulp": "gulp"
    
## Gulp使用手册

Gulp是一个流式构建系统。它的流式特性意味着开发者

Gulp API主要包括4个顶级函数。如下

- `gulp.task(name, deps, fn)`  定义任务
- `gulp.src(globs, [opt])`  指向我们想要操作的源文件
- `gulp.dest`  指向输出文件
- `gulp.watch`  用于监视文件的变化

其中文文档可以参考[该链接](https://github.com/lisposter/gulp-docs-zh-cn/blob/master/API.md)。

### `gulp.task(name[, deps], fn)`

用于定义Gulp任务。包括三个参数

- name: 任务名，字符串
- deps: 一组依赖任务的数组，它是可选的
- fn: 执行任务的函数

```javascript
gulp.task('mytask', function() {
  //do stuff
});

gulp.task('dependenttask', ['mytask'], function() {
  //do stuff after 'mytask' is done.
});
```

详细内容请参考[该链接](https://github.com/lisposter/gulp-docs-zh-cn/blob/master/API.md#gulptaskname-deps-fn)。

### `gulp.src(globs[, options])`和`gulp.dest(path[, options])`

`gulp.src`指向我们想要使用的文件。它的参数是globs和可选的选项对象。它使用`.pipe()`将输出值链接（chaining）到其他插件中。

详细内容请参考[该链接](https://github.com/lisposter/gulp-docs-zh-cn/blob/master/API.md#gulpsrcglobs-options)

`gulp.dest`指向我们想要写入结果文件的输出文件夹。

假如我们想要定义一个任务`copHtml`将输入文件复制到输出文件夹中，代码如下：

```javascript
gulp.task('copyHtml', function() {
  // copy any html files in source/ to public/
  gulp.src('source/*.html').pipe(gulp.dest('public'));
});
```

### `gulp.watch(glob[, opts], tasks)`

和`gulp.task`类似，`gulp.watch`也有一个可选的中间参数。`gulp.watch`返回的是一个发射（emits）`change`事件的`EventEmitter`。

```javascript
gulp.watch('source/javascript/**/*.js', ['jshint']);
```

匹配的任意文件如果发生了变化，就会自动触发`jshint`任务。

详细内容请参考[该链接](https://github.com/lisposter/gulp-docs-zh-cn/blob/master/API.md#gulpwatchglob--opts-tasks-或-gulpwatchglob--opts-cb)

## 常用任务

### JShint

每次我们保存一个JS文件的时候就利用JSHint进行代码检查。我们需要如下插件：

    $ npm install --save-dev gulp-jshint jshint-stylish

任务编写如下：

```javascript
// grab our packages
var gulp   = require('gulp'),
    jshint = require('gulp-jshint');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['jshint']);
});
```

如果你要单独的执行`jshint`任务，你可以使用如下命令：

    $ gulp jshint
    
### 编译Sass文件

[Sass](http://sass-lang.com/)是一个常用的CSS预处理语言，它用于增强CSS。我们需要安装`gulp-sass`：

    $ npm install --save-dev gulp-sass

任务实现如下：

```javascript
var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    sass   = require('gulp-sass');


/* jshint task would be here */

gulp.task('build-css', function() {
  return gulp.src('source/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/assets/stylesheets'));
});


/* updated watch task to include sass */

gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['jshint']);
  gulp.watch('source/scss/**/*.scss', ['build-css']);
});
```

我们还可以加入`gulp-sourcemaps`。Sourcemap是一种用于将处理过的、最小化过的、更改过的文件映射到源文件的强大功能。
支持`gulp-sourcemaps`的插件列表可以参考[该链接](https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support)。

```javascript
var gulp       = require('gulp'),
    jshint     = require('gulp-jshint'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('build-css', function() {
  return gulp.src('source/scss/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
      .pipe(sass())
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest('public/assets/stylesheets'));
});
```

如果你使用的是Less，那么可以使用`gulp-less`插件，使用起来也非常的简单：

```javascript
var less = require('gulp-less');
 
gulp.task('less', function() {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});
```

### JavaScript拼接和最小化

我们经常需要将多个文件合并在一起，或者是将一个大文件进行最小化（去除其中的空格等），借助gulp我们能够很容易的做到这些。
需要安装如下依赖：

    $ npm install --save-dev gulp-concat gulp-uglify

任务实现如下:

```javascript
gulp.task('build-js', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/javascript'));
});
```

## 插件

Gulp的插件列表你可以使用[这个工具](http://gulpjs.com/)进行检索。

### gulp-load-plugins

[gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins)是一个非常有用的插件，
它能够自动的从`package.json`中加载所有的Gulp插件，然后将它们附加到一个对象上。它的用法如下：

```javascript
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('js', function () {
   return gulp.src('js/*.js')
     .pipe(plugins.jshint())
     .pipe(plugins.jshint.reporter('default'))
     .pipe(plugins.uglify())
     .pipe(plugins.concat('app.js'))
     .pipe(gulp.dest('build')); 
});
```

## 小结

在本文中我们只浅显的探讨了Gulp的使用。Gulp还能够执行很多复杂的任务，因为Gulp依赖于你编写代码来实现这些任务。
例如，我们可以自动化构建项目源文件，实现文件的检查、拼接、最小化，然后在将构建后的项目自动部署到线上。
通过Gulp你能够快速而简单的完成这些任务。有关Gulp的高级用法，你可以参考[这篇博文](http://csspod.com/advanced-tips-for-using-gulp-js/)。

## References

- [Gulp API Docs](https://github.com/lisposter/gulp-docs-zh-cn/blob/master/API.md)
- [Gulp Website](http://gulpjs.com/)
- [Gulp tutorial](https://scotch.io/tutorials/automate-your-tasks-easily-with-gulp-js)
- [Another Gulp tutorial](http://zinoui.com/blog/task-automation-with-gulp-js)
- [Node.js API: Stream](https://nodejs.org/dist/latest-v4.x/docs/api/stream.html#stream_stream)