---
layout: post
title: JavaScript的抽象语法树与语法解析
category: technique
---

抽象语法树（Abstract Syntax Tree）也称为AST语法树，指的是源代码语法所对应的树状结构。也就是说，对于一种具体编程语言下的源代码，通过构建语法树的形式将源代码中的语句映射到树中的每一个节点上。

<!--more-->

## JavaScript语法解析

### 什么是语法树

可以通过一个简单的例子来看语法树具体长什么样子。有如下代码：
	
	var AST = "is Tree";

![JavaScript AST](/img/posts/0710-ast.PNG)

我们可以发现，程序代码本身可以被映射成为一棵语法树，而通过操纵语法树，我们能够精准的获得程序代码中的某个节点。例如声明语句，赋值语句，而这是用正则表达式所不能准确体现的地方。JavaScript的语法解析器[Espsrima](http://esprima.org/)提供了一个[在线解析的工具](http://esprima.org/demo/parse.html)，你可以借助于这个工具，将JavaScript代码解析为一个JSON文件表示的树状结构。

### 有什么用

抽象语法树的作用非常的多，比如编译器、IDE、压缩优化代码等。在JavaScript中，虽然我们并不会常常与AST直接打交道，但却也会经常的涉及到它。例如使用UglifyJS来压缩代码，实际这背后就是在对JavaScript的抽象语法树进行操作。

在一些实际开发过程中，我们也会用到抽象语法树，下面通过一个小栗子来看看怎么进行JavaScript的语法解析以及对节点的遍历与操纵。

## 举个栗子

## 小需求

我们将构建一个简单的静态分析器，它可以从命令行进行运行。它能够识别下面几部分内容：

- 已声明但没有被调用的函数
- 调用了未声明的函数
- 被调用多次的函数

现在我们已经知道了可以将代码映射为AST进行语法解析，从而找到这些节点。但是，我们仍然需要一个语法解析器才能顺利的进行工作，在JavaScript的语法解析领域，一个流行的开源项目是Esprima，我们可以利用这个工具来完成任务。此外，我们需要借助Node来构建能够在命令行运行的JS代码。b

完整代码地址：
	
	https://github.com/wwsun/awesome-javascript/tree/master/src/day05

### 准备工作

为了能够完成后面的工作，你需要确保安装了Node环境。首先创建项目的基本目录结构，以及初始化NPM。

	mkdir esprima-tutorial
	cd esprima-tutorial
	npm install esprima --save

在根目录新建`index.js`文件，初试代码如下：

	var fs = require('fs'),
	    esprima = require('esprima');
	
	function analyzeCode(code) {
	    // 1
	}
	
	// 2
	if (process.argv.length < 3) {
	    console.log('Usage: index.js file.js');
	    process.exit(1);
	}
	
	// 3
	var filename = process.argv[2];
	console.log('Reading ' + filename);
	var code = fs.readFileSync(filename);
	
	analyzeCode(code);
	console.log('Done');

在上面的代码中：

1. 函数`analyzeCode`用于执行主要的代码分析工作，这里我们暂时预留下来这部分工作待后面去解决。
2. 我们需要确保用户在命令行中指定了分析文件的具体位置，这可以通过查看`process.argv`的长度来得到。为什么？你可以参考Node的官方文档：

	> The first element will be ‘node’, the second element will be the name of the JavaScript file. The next elements will be any additional command line arguments.

3. 获取文件，并将文件传入到`analyzeCode`函数中进行处理

### 解析代码和遍历AST

借助Esprima解析代码非常简单，只要使用一个方法即可：

	var ast = esprima.parse(code);

`esprima.parse()`方法接收两种类型的参数：字符串或Node的`Buffer`对象，它也可以收附加的选项作为参数。解析后返回结果即为抽象语法树（AST)，AST遵守Mozilla SpiderMonkey的[解析器API](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API)。例如代码：

	6 * 7

解析后的结果为：

	{
	    "type": "Program",
	    "body": [
	        {
	            "type": "ExpressionStatement",
	            "expression": {
	                "type": "BinaryExpression",
	                "operator": "*",
	                "left": {
	                    "type": "Literal",
	                    "value": 6,
	                    "raw": "6"
	                },
	                "right": {
	                    "type": "Literal",
	                    "value": 7,
	                    "raw": "7"
	                }
	            }
	        }
	    ]
	}

我们可以发现每个节点都有一个type，根节点的type为`Program`。type也是所有节点都共有的，其他的属性依赖于节点的type。例如上面实例的程序中，我们可以发现根节点下面的子节点的类型为`EspressionStatement`，依此类推。

为了能够分析代码，我们需要对得到的AST进行遍历，我们可以借助[Estraverse](https://github.com/Constellation/estraverse)进行节点的遍历。执行如下命令进行安装该NPM包：

	npm install estraverse --save

基本用法如下：

	function analyzeCode(code) {
	    var ast = esprima.parse(code);
	    estraverse.traverse(ast, {
	        enter: function (node) {
	            console.log(node.type);
	        }
	    });
	}

上面的代码会输出遇到的语法树上每个节点的类型。

### 获取分析数据

为了完成需求，我们需要遍历语法树，并统计每个函数调用和声明的次数。因此，我们需要知道两种节点类型。首先是函数声明：

	{
	    "type": "FunctionDeclaration",
	    "id": {
	        "type": "Identifier",
	        "name": "myAwesomeFunction"
	    },
	    "params": [
	        ...
	    ],
	    "body": {
	        "type": "BlockStatement",
	        "body": [
	            ...
	        ]
	    }
	}

对函数声明而言，其节点类型为`FunctionDeclaration`，函数的标识符（即函数名）存放在`id`节点中，其中`name`子属性即为函数名。`params`和`body`分别为函数的参数列表和函数体。

我们再来看函数调用：
	
	"expression": {
	    "type": "CallExpression",
	    "callee": {
	        "type": "Identifier",
	        "name": "myAwesomeFunction"
	    },
	    "arguments": []
	}

对函数调用而言，即节点类型为`CallExpression`，`callee`指向被调用的函数。有了上面的了解，我们可以继续完成我们的程序如下：

	function analyzeCode(code) {
	    var ast = esprima.parse(code);
	
	    var functionsStats = {}; //1

	    var addStatsEntry = function (funcName) { //2
	        if (!functionsStats[funcName]) {
	            functionsStats[funcName] = { calls: 0, declarations: 0 };
	        }
	    };
	
		// 3
	    estraverse.traverse(ast, {
	        enter: function (node) {
	            if (node.type === 'FunctionDeclaration') {
	                addStatsEntry(node.id.name); //4
	                functionsStats[node.id.name].declarations++;
	            } else if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
	                addStatsEntry(node.callee.name);
	                functionsStats[node.callee.name].calls++; //5
	            }
	        }
	    });
	}

1. 我们创建了一个对象`functionStats`用来存放函数的调用和声明的统计信息，函数名作为key。
2. 函数`addStatsEntry`用于实现存放统计信息。
3. 遍历AST
4. 如果发现了函数声明，增加一次函数声明
5. 如果发现了函数调用，增加一次函数调用

### 处理结果

最后进行结果的处理，我们只需要遍历查看`functionStats`中的信息就可以得到结果。创建结果处理函数如下：

	function processResults(results) {
	    for (var name in results) {
	        if (results.hasOwnProperty(name)) {
	            var stats = results[name];
	            if (stats.declarations === 0) {
	                console.log('Function', name, 'undeclared');
	            } else if (stats.declarations > 1) {
	                console.log('Function', name, 'decalred multiple times');
	            } else if (stats.calls === 0) {
	                console.log('Function', name, 'declared but not called');
	            }
	        }
	    }
	}

然后，在`analyzeCode`函数的末尾调用该函数即可，如下：

	processResults(functionsStats);

### 测试

创建测试文件`demo.js`如下：

	function declaredTwice() {
	}
	
	function main() {
	    undeclared();
	}
	
	function unused() {
	}
	
	function declaredTwice() {
	}
	
	main();

执行如下命令：

	$ node index.js demo.js

你将得到如下的处理结果：

	Reading test.js
	Function declaredTwice decalred multiple times
	Function undeclared undeclared
	Function unused declared but not called
	Done

## 小结

是时候进行小结，本文主要介绍了如何对JavaScript代码使用Esprima进行解析，解析后的结果是一棵符合SpiderMonkey解析API的语法树，然后我们使用Estraverse进行遍历，在遍历过程中我们通过识别节点类型来判断代码位置。最后，如果你需要修改节点，你可以参考[3]。

## References

1. [Esprima tutorial](http://sevinf.github.io/blog/2012/09/29/esprima-tutorial/)
2. [Fun with Esprima and Static Analysis](http://tobyho.com/2013/12/02/fun-with-esprima/)
3. [Parsing and modifying JavaScript code with Esprima and Scodegen](http://www.mattzeunert.com/2013/12/30/parsing-and-modifying-Javascript-code-with-esprima-and-escodegen.html)