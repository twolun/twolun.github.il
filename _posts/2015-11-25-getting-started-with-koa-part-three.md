---
layout: post
title: 深入浅出Koa（3）：Koa的入门和实现
category: technique
---

前面我们了解Koa的两大基础：生成器和co，Koa是基于这两者之上的新一代的Node中间件框架。
为了能够让你更透彻的理解Koa，本文将要介绍的是Koa的实现。

<!--more-->

## Koa入门

对于Koa而言，你需要知道的并没有很多。如果你阅读了它的源代码的话，你甚至会发现总共才4个文件，每个才300行左右。
Koa遵循了每个程序只做一件事并将其做的更好的原则。你会发现，每个优秀的Koa模块都非常的紧凑，并且只做一件事，
并且在其他模块的基础上进行构建。你应该记住这一点，并使用这个方法来开发你自己的Koa模块。这将会有益于所有人，
也有助于你和其他人阅读源代码。先记住这一点后，然后我们来看看Koa的一些核心特性。

### 应用 Application

	var koa = require('koa');
	var app = koa();
	
创建一个Koa应用只不过是在调用一个相关的模块函数而已。它会提供给你一个对象，这个对象包含一个生成器数组
（一组中间件），对收到的每个请求，它会使用一种堆栈式的方法执行。

### 级联 Cascading

当你使用Koa时，一个非常重要的术语是中间件。现在让我们来搞清楚这个概念。

> Koa中的中间件是一组用于处理请求的函数。使用Koa创建的服务器，可以有一组堆栈结构的中间件与它关联。

级联在Koa中意味着：控制流会流经一组中间件。在web开发中这个概念非常的有用，你可以将复杂的行为借助于这个手段变得简单。
Koa通过生成器函数来实现这一点（中间件级联），并且更具创新性和简洁性。
**它能够`yiled`下游中间件，之后控制流再返回到上游中间件**。
将生成器加入到控制流中非常简单，只要在调用`use()`方法时使用生成器即可。
猜猜下面的代码为什么每次接收到请求时会输出的是`A, B, C, D, E`。

下面的代码演示了一个服务器，因此`listen`方法用于监听一个具体的端口：

	var koa = require('koa');
	var app = koa();
	
	// 1
	app.use(function *(next) {
	
		console.log('A');
		yield next;
		console.log('E');
	
	});
	
	// 2
	app.use(function *(next) {
		console.log('B');
		yield next;
		console.log('D');
	});
	
	// 3
	app.use(function *(next) {
		console.log('C');
	});
	
	app.listen(3000);
	
当一个新的请求进来的时候，它会流经一系列的中间件（即按照`use`方法调用的顺序`1-2-3`）。因此在上面的示例代码中，
请求首先经过第一个中间件，它会首先输出`A`，然后它遇到了`yield next`语句，这会使它转入下一个中间件计算相应的结果，
只有在处理完后才回到离开的地方。因此，接下来会转入到下一个中间件打印`B`，再次碰到`yield next`，
转入下一个中间件，打印`C`。现在已经没有更多的中间件了，因此执行完第三个中间件就会回流，首先回到第二个中间件，
继续执行打印出`D`，中间件2的代码执行完毕，再回流到第一个中间件，打印`E`。

到目前为止，`Koa`模块本身并没有什么复杂的地方，因此没有必要再追溯那些你可以在文档中就能知道的信息。
我推荐你直接去阅读`Koa`的文档去了解关于Koa的详细使用说明，其实也没有什么复杂的内容，所以这里也就不再多介绍了。
这里列出相关文档的链接：

- [Context](http://koajs.com/#context)
- [Request](http://koajs.com/#request)
- [Response](http://koajs.com/#response)
- [其他](http://koajs.com/#settings)

让我们再来看一个例子（这个例子来源于Koa的官网），它利用了一些HTTP特性。第一个中间件计算了响应的时间。
你会发现获取响应开始和结束的时间非常简单。并且在Koa中你可以优雅的将这些功能模块分离开。

	app.use(function *(next) {  
		var start = new Date;
		yield next;
		var ms = new Date - start;
		this.set('X-Response-Time', ms + 'ms');
	});
	
	app.use(function *(next) {  
		var start = new Date;
		yield next;
		var ms = new Date - start;
		console.log('%s %s - %s', this.method, this.url, ms);
	});
	
	app.use(function *() {  
		this.body = 'Hello World';
	});
	
	app.listen(3000);
	
	
## Koa的实现

下面我们来看看koa的源代码，为了简单起见，我们解读的是`v1.x`的[源码](https://github.com/koajs/koa/blob/v1.x/lib/application.js)。
本部分的内容主要参考了[阮一峰的koa介绍](http://javascript.ruanyifeng.com/nodejs/koa.html)的博文。
koa项目的入口文件时`lib/application.js`，代码的框架大致如下：

	function Application() {
		if (!(this instanceof Application)) return new Application;
		this.env = process.env.NODE_ENV || 'development';
		this.subdomainOffset = 2;
		this.middleware = [];
		this.context = Object.create(context);
		this.request = Object.create(request);
		this.response = Object.create(response);
	}
	
	var app = Application.prototype;
	
	exports = module.exports = Application;
	
`app.use()`用于注册中间件，即将生成器函数放入中间件数组：

	app.use = function(fn){
		if (!this.experimental) {
			// es7 async functions are allowed
			assert(fn && 'GeneratorFunction' == fn.constructor.name, 'app.use() requires a generator function');
		}
		debug('use %s', fn._name || fn.name || '-');
		this.middleware.push(fn);
		return this;
	};

`app.listen()`就是将`http.createServer(app.callback()).listen(...)`封装了一层：

	app.listen = function(){
		debug('listen');
		var server = http.createServer(this.callback());
		return server.listen.apply(server, arguments);
	};
	
	app.callback = function(){
		
		// 将respond函数放入this.middleware
		var mw = [respond].concat(this.middleware); 
		var fn = this.experimental
			? compose_es7(mw)
			: co.wrap(compose(mw)); // 将中间件数组转为一个层层调用的生成器函数
		var self = this;
		
		if (!this.listeners('error').length) this.on('error', this.onerror);
		
		return function(req, res){
			res.statusCode = 404;
			var ctx = self.createContext(req, res);
			onFinished(res, ctx.onerror);
			fn.call(ctx).catch(ctx.onerror);
		}
	};

在上面的代码中，`app.callback()`会返回一个函数，用来处理HTTP请求。它的第一行代码用于将`respond`函数放入`this.middleware`，
现在`mw`数组就包括了`[respond, s1, s2, s3]`。

`compose(mw)`用于将中间件数组转为一个层层调用的生成器函数。我们来看它的源码：

	function compose(middleware){
		return function *(next){
			if (!next) next = noop();
		
			var i = middleware.length;
		
			while (i--) {
			next = middleware[i].call(this, next);
			}
		
			yield *next;
		}
	}
	
	function *noop(){}

在上面的代码中，下一个生成器函数总是上一个生成器函数的参数，从而保证了层层调用。
`var fn = co.wrap(gen)`则是将生成器函数包装成自动执行的函数，并且返回一个Promise。

	co.wrap = function (fn) {
		return function () {
			return co.call(this, fn.apply(this, arguments));	
		}	
	}

将所有的上下文变量都放进`context`对象中：

	app.createContext = function(req, res){
		var context = Object.create(this.context);
		var request = context.request = Object.create(this.request);
		var response = context.response = Object.create(this.response);
		context.app = request.app = response.app = this;
		context.req = request.req = response.req = req;
		context.res = request.res = response.res = res;
		request.ctx = response.ctx = context;
		request.response = response;
		response.request = request;
		context.onerror = context.onerror.bind(context);
		context.originalUrl = request.originalUrl = req.url;
		context.cookies = new Cookies(req, res, this.keys);
		context.accept = request.accept = accepts(req);
		context.state = {};
		return context;
	};
	
而真正处理HTTP请求的是下面这个生成器函数：

	function *respond(next) {
		yield *next;
		
		// allow bypassing koa
		if (false === this.respond) return;
		
		var res = this.res;
		if (res.headersSent || !this.writable) return;
		
		var body = this.body;
		var code = this.status;
		
		// ignore body
		if (statuses.empty[code]) {
			// strip headers
			this.body = null;
			return res.end();
		}
		
		if ('HEAD' == this.method) {
			if (isJSON(body)) this.length = Buffer.byteLength(JSON.stringify(body));
			return res.end();
		}
		
		// status body
		if (null == body) {
			this.type = 'text';
			body = this.message || String(code);
			this.length = Buffer.byteLength(body);
			return res.end(body);
		}
		
		// responses
		if (Buffer.isBuffer(body)) return res.end(body);
		if ('string' == typeof body) return res.end(body);
		if (body instanceof Stream) return body.pipe(res);
		
		// body: json
		body = JSON.stringify(body);
		this.length = Buffer.byteLength(body);
		res.end(body);
	}

## 总结

现在你已经熟悉了Koa的[核心内容](https://blog.risingstack.com/introduction-to-koa-generators/)，
虽然使用旧的框架也能够完成相关的任务，但是现在你可以尝试Koa这个新的框架来解决以前的问题。因为，
在旧的框架中可能有非常多的功能是你从来都用不到的，或者某些并不是按照你的设想工作的。
现在，以Koa为代表的现代Node框架能够为你带来这些改变。你可以使用更轻量级的核心，
然后通过npm引入你需要的模块到你的app中，这种方式下你能够完全的控制哪些模块是你需要用的。

## References

1. http://javascript.ruanyifeng.com/nodejs/koa.html