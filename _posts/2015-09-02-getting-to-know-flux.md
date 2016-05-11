---
layout: post
title: Flux入门
category: technique
---

本文我们来讨论Facebook的Flux架构是如何工作的，以及我们应该如何在项目中使用它。如果你对React了解的还不够多，我强烈建议你
阅读前两篇文章，分别是[React的核心入门知识](http://wwsun.me/posts/react-getting-started.html)和
[使用Node和React构建一个事实的Twitter流展示系统](https://scotch.io/tutorials/build-a-real-time-twitter-stream-with-node-and-react-js)。
通过前面两篇文章，能让你对使用React构建应用有一个初步的人认识。

<!--more-->

### 声明

> 本文翻译自：https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture

## 什么是Flux

Flux是Facebook内部用来构建React应用的一套架构。它本身并不是一个框架或库。它仅仅是一个用于完善React应用开发的一种新的应用程序架构，
Flux架构最大的特点是其倡导的是单向数据流方案。

Facebook还提供了Dispatcher的开源库。你可以将Dispatcher认为是一种全局pub/sub系统的事件处理器，用于向所注册的回调函数广播payloads。
通常情况下，如果你使用Flux架构，你可以借助于Facebook提供的这个Dispatcher实现，并且可以借助NodeJS中的`EventEmitter`模块来配置事件系统，
从而帮助管理应用程序的状态。

### 组成结构

Flux主要包括下面四个独立的组件，下面简单的来解释下：

- Actions: 帮助向Dispatcher传递数据的辅助方法
- Dispatcher: 接收action，并且向注册的回调函数广播payloads
- Stores: 应用程序状态的容器 & 并且含有注册到Dispatcher的回调函数
- Controller Views: React组件，从Store获取状态，并将其逐级向下传递给子组件

让我们通过一幅图来简单看一下这四个部分的关系：

![Flux components](/img/posts/150902-flux-components.png)

### 如何处理外部API

但是，很多场景下不仅仅包括应用程序内部的状态数据，还可能包括来自外部的数据，也就是如果我们需要消费RESTful服务，
那么我们该如何将这些外部数据引入到Flux架构的单向数据流中呢？经过实践，我们发现，在Action中引入外部数据流是个不错的实践，
数据然后再被送到Store中。

在继续阅读之前，我强烈建议你阅读下Facebook提供的Flux官方示例程序的[源代码](https://github.com/facebook/flux/tree/master/examples/flux-todomvc)。
在你简单的阅读了这个例子的源代码后，我们再来详细的探讨Flux中这几个组件的作用：

## Dispatcher

我们首先来看看Dispatcher的作用：你可以将Dispatcher看成是Flux架构中整个数据流程的管理者。或者你可以将它看成是是你整个应用的中央交换机。
Dispatcher接收actions作为payloads，并且将payloads分发给所注册的回调函数。

**那么它就是一个pub/sub吗？**

不完全是。Dispatcher会将payload广播给所有向他注册的回调函数，并且包括了允许你以指定次序调用这些回掉函数的执行逻辑，
例如在处理前等待数据更新。在Flux架构中只有一个Dispatcher，它是你整个应用的中央hub。我们来创建一个简单的Dispatcher：

	var Dispatcher = require('flux').Dispatcher;
	var AppDispatcher = new Dispatcher();
	
	AppDispatcher.handleViewAction = function(action) {
		this.dispatch({
			source: 'VIEW_ACTION',
			action: action
		});
	}
	
	module.exports = AppDispatcher;
	
在上面的代码中，我们创建了一个Dispatcher的实例，它包括了一个叫做`handleViewAction`的方法。创建这个方法的目的是为了让你能够轻松的区分，
是视图层触发的action，还是服务器/API触发的action。

在`handleViewAction`方法中调用了`dispatch`方法（该方法来自Dispatcher实现），它会将payloads广播给所有注册到它的回调函数
（注意，这里所说的回调是在store中注册给Dispatcher的）。然后，action会触发Store中相应事件，并最终体现在state的更新上。

可以用下面这张图来表示这个过程：

![Dispatcher](/img/posts/150902-flux-dispatcher.png)

### 依赖

Facebook所提供的Dispatcher模块还有一个非常赞的功能，那就是它能够定义依赖，并在Store中向Dispatcher注册回调函数。
因此，如果你的应用的某个部分依赖于其他部分的数据更新，为了能够进行合适的渲染，Dispatcher中的`waitFor`方法将会非常有用。

为了能够利用这一特性，我们需要在Store中存储注册给Dispatcher的回调函数的返回值，这里，我们命名为`dispatcherIndex`：

	ShoeStore.dispatcherIndex = AppDispatcher.register(function(payload) {
	
	});
	
然后在Store中处理每一个被分发的action时，我们可以使用Dispatcher的`waitFor`方法来确保我们的`ShoeStore`已经被更新了，示例代码如下：

	case 'BUY_SHOES':
		AppDispatcher.waitFor([
			ShoeStore.dispatcherIndex
		], function() {
			CheckoutStore.purchaseShoes(ShoeStore.getSelectedShoes());
		});
		break;
	
### Stores

在Flux中，可以用Store来分领域的管理应用程序的状态，例如`ShoeStore`、`AppStore`等。
从一个更高层角度来看，可以简单的认为应用的每一个部分可以对应于一个Store，Store可以用来
管理数据，定义数据检索方法，此外，Store中还包括了注册给Dispatcher的回调函数。

下面我们来看一个简单的Store的例子：

    var AppDispatcher = require('../dispatcher/AppDispatcher');
    var ShoeConstants = require('../constants/ShoeConstants');
    var EventEmitter = require('events').EventEmitter;
    var merge = require('react/lib/merge');
    
    // Internal object of shoes
    var _shoes = {};
    
    // Method to load shoes from action data
    function loadShoes(data) {
      _shoes = data.shoes;
    }
    
    // Merge our store with Node's Event Emitter
    var ShoeStore = merge(EventEmitter.prototype, {
    
      // Returns all shoes
      getShoes: function() {
        return _shoes;
      },
    
      emitChange: function() {
        this.emit('change');
      },
    
      addChangeListener: function(callback) {
        this.on('change', callback);
      },
    
      removeChangeListener: function(callback) {
        this.removeListener('change', callback);
      }
    
    });
    
    // Register dispatcher callback
    AppDispatcher.register(function(payload) {
      var action = payload.action;
      var text;
      // Define what to do for certain actions
      switch(action.actionType) {
        case ShoeConstants.LOAD_SHOES:
          // Call internal method based upon dispatched action
          loadShoes(action.data);
          break;
    
        default:
          return true;
      }
      
      // If action was acted upon, emit change event
      ShoeStore.emitChange();
    
      return true;
    
    });
    
    module.exports = ShoeStore;
    
以上代码可能做的最重要的一件事就是：我们使用NodeJS中的`EventEmitter`模块来扩展我们的Store。
这使得我们的Store能够监听和广播事件。这也使得我们的视图/组件能够基于这些事件来更新。
这是因为我们的控制器视图（Controller View）会监听我们的Store，
并利用这一点通过发出事件方式通知控制器视图应用程序的状态发生了改变，
从而进行视图层的重新渲染。
 
在Store中还有一个值得注意的事，那就是我们使用Dispatcher的`regiter`方法来注册回调函数。
这意味着，我们创建的Store会监听来自`AppDispatcher`的广播，这里我们使用`switch`语句来
区分广播内容所对应的action。如果一个相关的action发生了，那么就触发一个change事件，并且监听
此事件的视图会根据新的状态（state）进行重新渲染。这个过程如下图所示。
 
 ![Store](/img/posts/150902-flux-store.png)
 
在上面的代码中，`ShoeStore`中还包括一个公共方法`getShoes()`，它可以在控制器视图中被调用，
用于检索所有在`_shoes`对象中的数据，并且使用这个数据作为组件的状态数据。因为这是个非常简单
的例子，在实际应用开发中你可以使用更加复杂的数据处理逻辑。
 
 ### Action创建器和Actions
 
行为创建器（Action Creators）是一组会在视图中被调用的方法（也可以在其他地方使用），
它们用于向Dispatcher发送actions。也就是说，我们使用Dispatcher分发的payloads，实际上就是actions。

在Facebook提供的例子中，action的类型常数被用于定义这些action所被应用的场景，并且
是伴随着action一起被传递的。现在，在所注册的回调函数内部，这些actions可以根据他们的action类型来处理。

我们可以看一个简单的类型常数的定义：
 
    var keyMirror = require('react/lib/keyMirror');
    
    module.exports = keyMirror({
        LOAD_SHOES: null
    });
    
在上面的代码中，我们用了React的`keyMirror`库来生成我们的类型常数的Key/Value对。如果仅仅
是看这个文件，我们大致可以猜到我们的应用会加载鞋子（shoes）。借助于类型常数，可以使得应用
中涉及到的事物变得更加的可组织，可以让开发者能通过这样的高层抽象来组织应用程序。

现在，让我们来大致的看一个对应的行为创建器（action creator）的定义：

    var AppDispatcher = require('../dispatcher/AppDispatcher');
    var ShoeStoreConstants = require('../constants/ShoeStoreConstants');
    
    var ShoeStoreActions = {
    
        loadShoes: function(data) {
            AppDispatcher.handleViewAction({
                actionType: ShoeStoreConstants.LOAD_SHOES,
                data: data
            })
        }
    
    };

在上面的代码中，我们在定义了`ShoeStoreActions`对象，并在其中定义了`loadShoes()`方法，
该方法内调用了来自`AppDispatcher`的`handleViewAction`方法，并且将相应的行为类型与
我们提供的数据相关联。现在，我们可以在我们的视图代码或API中引入这个action文件。我们可以
调用`ShoeStoreActions.loadShoes(ourData)`方法来向Dispatcher发送payload，随后Dispatcher
会将它广播出去。`ShoeStore`则会监听来自Dispatcher的广播，并且触发相应的事件来加载相应的鞋子。

### 控制器视图 Controller View

你可以简单的将控制器视图理解为React组件，这些组件会监听change事件，如果事件发生了，
就从Stores中获取应用程序新的状态数据。随后，可以将数据通过`props`逐级向子组件传递。这个过程大致如下图所示：

![controller view](/img/posts/150902-flux-view.png)

让我们来看看代码长啥样：

    var React = require('react');
    var ShoesStore = require('../stores/ShoeStore');
    
    // Method to retrieve application state from store
    function getAppState() {
    return {
        shoes: ShoeStore.getShoes()
    };
    }
    
    // Create our component class
    var ShoeStoreApp = React.createClass({
    
    // Use getAppState method to set initial state
    getInitialState: function() {
        return getAppState();
    },
    
    // Listen for changes
    componentDidMount: function() {
        ShoeStore.addChangeListener(this._onChange);
    },
    
    // Unbind change listener
    componentWillUnmount: function() {
        ShoesStore.removeChangeListener(this._onChange);
    },
    
    render: function() {
        return (
        <ShoeStore shoes={this.state.shoes} />
        );
    },
    
    // Update view state when change event is received
    _onChange: function() {
        this.setState(getAppState());
    }
    
    });
    
    module.exports = ShoeStoreApp;
    
在上面的代码中，我们使用`addChangeListener`来监听change事件，并且在接收到事件后更新应用程序的状态数据。
 
我们的应用程序状态数据存储在Store中，因此我们可以用Store中的公共方法来获取数据，然后
将其设置为应用程序的状态。

## 完整的数据流程

前面我们依次解读了Flux架构中的每一个独立部分，我们有了对Flux架构中的每一个组件的一个大致的认识，
并且能大致的了解了Flux架构的工作流。在这之前，我们已经通过了几张图片描述了数据在组件之间的流向，
现在让我们将上面的子流程组合起来，以更好的理解Flux的数据流：

![flux flow](/img/posts/150902-flux-flow.png)
 
## 小结

在读完这篇文章后，如果你之前并不了解Facebook的Flux架构，那么希望你现在能够说理解了。
但另一方面，如果不在React的实际编程开发中使用这一架构，你是很难真正的体会到Flux架构的
特点的。

当你使用Flux后，你会发现没有Flux的React应用开发就相当于是没有jQuery的DOM遍历操作。也就是说，
没有Flux你可以照常进行React应用开发，但是你在代码组织和数据流程上会缺乏优雅的解决方案。

另一个方面，如果你想使用FLux架构，但你并不想使用React，那么你可以参考[Delorean](https://github.com/deloreanjs/delorean),
它是一个Flux框架，并且可以让你使用Ractive.js或者Flight。另一个值得参考的库是
[Fluxxor](http://fluxxor.com/)，它实现了在紧耦合的Flux组件中包含一个中央Flux实例。

最后，再次说明，如果要真正的理解Flux，你就得在实际开发中体验它。