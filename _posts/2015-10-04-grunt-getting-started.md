---
layout: post
title: 使用Grunt作为JavaScript应用构建工具
category: technique
---

构建工作主要包括合并静态文件、压缩文件大小、打包应用、编译模块等。为了能够让这些繁杂的任务能够自动进行，
通常我们会借助于构建工具的力量，它能够帮助我们提升效率、节约资源。本文将要介绍了是前端构建工具Grunt，
它具有跨平台的优势，Grunt由Node编写，具有很好的多平台兼容性。

<!--more-->

## Grunt

### 基础知识


Grunt是一个基于JavaScript的构建工具。和很多构建工具（`make`, `ant`）类似，Grunt主要用来自动化你的任务，
诸如代码最小化、代码编译、单元测试、代码规范校验等等重复的任务，你必须要做的工作越少，你的工作就变得越简单，
从而避免重复人工操作中的误操作。Grunt同样依赖于Node，使用NPM进行安装。通过文件`Gruntfile`进行配置任务流程，
这样你和你的团队就可以在之后非常简单的执行这些任务。

Grunt主要包括三个部分：

- GruntJS CLI 命令行工具
- GruntJS Task Runner 任务运行期
- Grunt Plugins 插件库

### 安装Grunt

为了能够在任何目录中都能使用grunt，首先你需要全局安装`grunt-cli`，它是grunt的命令行工具，
它并不会提供Grunt构建功能，而只是一个Grunt的调用器。
安装完之后，你可以在命令行中直接使用grunt（安装过程可能需要你具备管理员权限）。

	npm install -g grunt-cli

这个过程会自动将`grunt`加入到你的path环境变量中。需要注意的是，
安装了grunt-cli并不会同时安装grunt。 cli的主要工作就是，当你运行grunt命令时，
CLI载入本地安装的Grunt库，应用`Gruntfile`中的配置项，执行你所请求的任务。
你可以通过[链接页面](https://github.com/gruntjs/grunt-cli/blob/master/bin/grunt)查看grunt的源代码。

为了在项目中使用grunt，接下来你需要创建项目的`package.json`清单文件，该文件用于描述该Node项目。
关于[package.json](https://docs.npmjs.com/files/package.json)的更多信息请参考相关文档。
然后将grunt添加到在`package.json`文件总的依赖列表中即可。

你需要在项目中安装`grunt`依赖，此时不需要全局安装！并且指定`--save-dev`，指明其实一个开发阶段的依赖项。

	npm install grunt --save-dev

### 创建`Gruntfile.js`文件

最后一步是创建`Gruntfile.js`文件，Grunt通过这个文件来载入可用任务以及配置相关参数。
下面的代码展示了一个最简单的`Gruntfile.js`文件：

	module.exports = function (grunt) {
		grunt.registerTask('default', []); // 注册一个默认的任务
	}
	
值得关注的是，Grunt文件时一个普通的Node模块，遵循CommonJS模块化规范。

在上面的代码中，利用`grunt.registerTask`方法创建了一个名为`default`的默认任务，
当你在命令行中没有指定具体的任务的时候，默认的任务将会被执行。参数2则是一个任务列表，
你可以指定多个任务。

然后再项目的根目录执行如下命令即可运行grunt：

	grunt

### 设置Grunt任务

你可以通过安装插件来设置Grunt任务，并在代码中添加配置信息。Grunt插件通常都是作为npm的模块被发布的。
例如JSHint模块，你可以在Grunt中配置JSHint任务。但需要注意的是，你需要安装适用于Grunt的插件，
例如JSHint你需要安装的是`grunt-contrib-jshint`。

	npm install --save-dev grunt-contrib-jshint

你可以通过[Grunt的插件搜索](http://gruntjs.com/plugins)页面来检索你需要的插件。

接下来你要告诉Grunt你会使用的插件，并将其添加到指定的任务队列中，例如加入`default`任务队列。
现在`Gruntfile.js`的代码如下：

	module.exports = function (grunt) {
		
		// 配置任务
		grunt.initConfig({
			jshint: ['Gruntfile.js'],
		});
		
		// 每个插件都需要被逐个载入到Grunt中
		grunt.loadNpmTasks('grunt-contrib-jshint');
		
		grunt.registerTask('default', ['jshint']); // 注册一个默认的任务
	}

## 使用Grunt来管理构建过程

- Development flow 开发流：Preprocessing, Liniting, Unit testing （关心的是开发效率）
- Release flow 发布流：Compilation, Image spriting, Bunding, Heavy testing, Minification, Perf. tuning （关心的是性能）
- Deployment flow 部署流：关心的是稳定性

关于构建你可以参考[这篇文章](http://web.jobbole.com/83690/)，这篇文章介绍了绝大部分构建需要考虑到的事情。

### 将less转换成css

使用[LESS](http://lesscss.org/)可以让你的CSS代码遵守DRY原则，LESS的代码更易阅读，因为你可以对代码进行重用，
并且可以在CSS中使用变量。安装LESS插件：

	npm install grunt-contrib-less --save-dev
	
这个插件提供了一个名为`less`的任务，你可以在`Gruntfile.js`中载入它。

	grunt.loadNpmTasks('grunt-contrib-less');
	
`less`任务的配置对象如下：

	grunt.initConfig({
		less: {
			compile: {
				files: {
					'build/css/compiled.css': 'pubic/css/layout.less'
				}	
			}
		}
	})

在命令行执行`grunt less`即可触发任务。通常推荐你在`grunt`后指定运行的目标。因为这里只有`compile`目标，
因此这相当于执行`grunt less:compile`。如果你不提供目标名，则所有的目标都会被执行。

### 文件名匹配 Globbing patterns

[Globbing](http://gruntjs.com/configuring-tasks#globbing-patterns)是一种路径匹配机制，
用于辅助你使用文件路径模式来包含或去除一系列文件。示例如下：

	[
		'public/*.less',
		'public/**/*.less',
		'!public/vendor/**/*.less'
	]

1. 第一行会匹配public目录下的所有less文件
2. 第二行会匹配public目录下所有处于子文件夹中的Less文件
3. `!`表示忽略所有匹配的文件

理解Globbing模式，你需要知道如下几个匹配符的作用：

- `*` 匹配任意个字符，除了`/`
- `?` 匹配单个字符，除了`/`
- `**` 匹配任意个字符，包括`/`
- `{}` 匹配多个选项中的一个，使用逗号分隔 
- `!` 放在模式的最前方，表示忽略匹配符合的项

Globbing模式会按照它们所处的先后位置进行匹配。你可以将上面的配置更改为：

	files: {
		'build/css/compiled.css': 'public/css/**/*.less'		
	}

### 打包静态文件

静态文件打包可以理解为将文件合并起来，这样的话，可以将文件请求减少为单个HTTP响应，从而减少网络的运输开销。
虽然单个文件的载荷可能过大，不过它能够节省客户端的资源开销，避免发起过多的HTTP请求。换句话说，
可以将静态文件打包简单的理解为将多个文件拼接在一起。

![bundling static assets](/img/posts/151104-static-bundling.png)

你可以使用`grunt-contrib-concat`插件进行静态资源的合并打包。载入插件，并配置如下：

    grunt.initConfig({
		concat: {
			js: {
				files: {
					'build/js/bundle.js': 'public/js/**/*.js'
				}
			}	
		}
	})

上面的代码将`public/js`下的所有js文件都合并包`bundle.js`文件中。

### 静态资源最小化

这个过程包括消除代码中的空格、缩短变量名，优化语法树等操作，从而减小文件的尺寸。并且可以组合服务端的[Gzip](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer?hl=en)压缩，
这个过程后你的源代码文件将被极大的缩小。

文件的打包可以组合文件最小化。两者的目标都是一致的：生成更少、更小的最适合发布的资源包。对于资源最小化而言，
你可以借助`grunt-contrib-uglify`插件包来最小化JS源文件。配置如下：

	grunt.initConfig({
		uglify: {
			cobra: {
				files: {
					'build/js/cobra.min.js': 'public/js/cobra.js'
				}	
			}	
		}
	})

接下来，你可以执行`grunt uglify:cobra`来运行该任务。

通常情况下，我们会在执行完打包命令后执行文件最小化操作。我们可以组合这两个任务：

	grunt.initConfig({
		uglify: {
			bundle: {
				files: {
					'build/js/bundle.min.js': 'build/js/bundle.js'
				}	
			}	
		}
	})

### 实施图像sprites

Sprites可以看成是对图像的打包，也就是将多个零散的图片文件组装成单个大文件。不再引用单个文件，
而是通过CSS的`background-position`、`width`、`height`属性来从sprites中选择子图像。

我推荐你使用`grunt-spritesmith`插件。它的配置选项如下所示：

	grunt.initConfig({
		sprite: {
			icons: {
				src: 'public/img/icons/*.png',
				destImg: 'build/img/icons.png',
				destCSS: 'build/css/icons.png'	
			}	
		}
	})

### 任务别名

任务的别名用于按顺序组织一组相关的任务，通过任务别名你可以用来组织工作流。在Grunt中，通过如下的方式来定义任务的别名：

    grunt.registerTask('js', 'Concatenate and minify js files', ['concat:js', 'uglify:bundle']);
	
- 参数1：名称
- 参数2：描述信息
- 参数3：任务列表

### 清理工作文件夹

为了达到代码完整性（code integrity），每次重新构建之前首先需要做的是清理工作文件夹，因为你需要确保每次构建后的结果是一致的，
因此最佳实践是在每次构建之前清理掉所有上一次构建后生成的文件。通常我们命名为`build`文件夹。

实际发布时，服务器使用的是构建后的文件，而不是源代码文件。还有一点需要再次提醒的是，最佳的做法是，将构建的文件和源代码文件分开。
例如上面提到的`build`文件夹放置构建后生成的文件，`src`放置源代码文件。

你需要使用`grunt-contrib-clean`插件，它提供了一个`clean`任务用于帮助你完成清除任务。在任务的配置中，
你需要提供需要清理的目标名，然后再目标名后通过globbing模式指定要清除文件路径。配置如下：

	grunt.initConfig({
		clean: {
			js: 'build/js',
			css: 'build/css',
			less: 'public/**/*.css'
		}		
	})

## 例子

我们通常会安装两个插件，分别是`load-grunt-tasks`[3]和`time-grunt`[4]。
第一个插件的作用是用来自动读取package.json文件中的`dependencies/ devDenpendencies/ peerDenpendencies`，
从而自动加载与给定模式匹配的Grunt任务。第二个插件的作用是在`console`窗口中显示任务的执行状态。

为了示例`Gruntfile.js`文件，我们还安装了官方的`grunt-contrib-copy`和`grunt-contrib-clean`文件用来进行文件的拷贝和清除。
借助这几个插件，我们编写的一个简单的`Gruntfile.js`文件如下：

	'use strict';
	
	module.exports = function (grunt) {
	    require('load-grunt-tasks')(grunt);
	
	    require('time-grunt')(grunt);
	
	    var config = {
	        app: 'app',
	        dist: 'dist'
	    };
	
	    grunt.initConfig({
	        config: config,
	        copy: {
	            dist: {
	                files: [
	                    {
	                        expand: true,
	                        cwd: '<%= config.app %>/',
	                        src: '*.html',
	                        dest: '<%= config.dist %>/',
	                        ext: '.min.html'
	                    }
	                ]
	            }
	        },
	
	        clean: {
	            dist: {
	                src: ['<%= config.dist %>/**/*'],
	                //filter: 'isFile' //only remove file, rather than folder
	                filter: function (filepath) {
	                    return (!grunt.file.isDir(filepath));
	                }
	            }
	        }
	    });
	};

一个Gruntfile通常由下面几部分组成：

- 包装函数： `module.exports = function(grunt) { ... }`
- 项目和任务配置: `grunt.initConfig(...)`
- 加载的Grunt插件和任务
- 自定义任务


实际上，Grunt任务的书写方式可以有很多种，这里我们只是推荐一种最通用的书写方式。我
们在`initConfig`中定义了两个task，分别为`copy`和`clean`。更多的关于task的配置，请参考[2]

### Grunt的组件

- 任务 task： 通常一个任务需要一个插件来完成某项具体的构建工作
- 配置 configuration: 传递给`grunt.initConfig`的对象，每个Grunt任务都需要某些配置信息

## References

1. http://icodeit.org/2013/10/using-grunt-as-your-build-tool/
1. https://github.com/gruntjs/grunt-cli/blob/master/bin/grunt
2. http://gruntjs.com/configuring-tasks
3. https://github.com/sindresorhus/load-grunt-tasks
4. https://github.com/sindresorhus/time-grunt