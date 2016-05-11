---
layout: post
title: JavaScript面向对象编程实践
category: technique
---

写本文的初衷是基于不久前写的一篇[JavaScript面向对象深入解读](http://wwsun.github.io/posts/javascript-oo-summary.html)这篇博文，
因此在此基础上谈一谈如何具体的使用面向对象的方式进行前端开发。随着认识的深入，将会形成一个系列，综述前端开发方式这些年来的变化。
本文通过面向对象的方式来解释组件开发的过程，我们将会以选项卡组件开发为例。向你介绍如何从零开始使用面向对象的方式开发前端组件。

<!--more-->

本文项目的源代码存放在[Github仓库](https://github.com/wwsun/component-tab)中。

## 从0到1

假设我们想创建一个Tab多选项卡组件，用于切换选择不同的内容。

初始的HTML结构如下：

```html
<div class="tab">
    <ul class="tab-menuWrapper">
        <li class="tab-menu">menu1</li>
        <li class="tab-menu">menu2</li>
        <li class="tab-menu">menu3</li>
        <li class="tab-menu">menu4</li>
    </ul>

    <div class="tab-contentWrapper">
        <div class="tab-content">content1</div>
        <div class="tab-content" style="display: none;">content2</div>
        <div class="tab-content" style="display: none;">content3</div>
        <div class="tab-content" style="display: none;">content4</div>
    </div>
</div>
```

初始的样式代码如下：

```css
ul {
    padding: 0;
    margin: 0;
}

.tab {
    width: 400px;
}

.tab-menuWrapper {
    padding-left: 20px;
}

.tab-menuWrapper li {
    float: left;
    display: inline;
    padding: 5px;
    border: 1px solid #333;
    border-bottom: none;
    margin-right: 5px;
    cursor: pointer;
}

.tab-contentWrapper {
    border: 1px solid #333;
    clear: left;
    padding: 5px;
}
```

我们需要使用面向对象的方式来实现Tab组件的展示和交互逻辑。

利用构造函数，我们编写`Tab`构造函数：

```javascript
function Tab(config) {

    this._root = config.root;
    var trigger = config.trigger || 'click';

    this._tabMenus = this._root.getElementsByClassName('tab-menu');
    this._tabContents = this._root.getElementsByClassName('tab-content');

    var self = this;

    var i,
        n;
    for (i = 0, n = this._tabMenus.length; i < n; i++) {
        this._tabMenus[i]._index = i;
        setEvent(this._tabMenus[i], trigger, function () {
            self.showItem(this._index);
        });
    }
}
```

其中`showItem(n)`方法用于显示目标文本框。实现如下

```javascript
Tab.prototype.showItem = function (n) {

    var i;
    for (i = 0; i < this._tabContents.length; i++) {
        this._tabContents[i].style.display = 'none';
    }
    this._tabContents[n].style.display = 'block';

};
```

`setEvent`方法用于事件绑定：

```javascript
var setEvent = function (node, eventType, handler, scope) {

    node = typeof node === 'string' ? document.getElementById(node) : node;
    scope = scope || node;

    node.addEventListener(eventType, function () {
        handler.apply(scope, arguments);
    });

};
```

最后让Tab组件工作：

```javascript
var tabs = document.getElementsByClassName('tab');

new Tab({
    root: tabs[0]
});
```

## 完善

我们想要高亮当前到选项卡。

我们首先增加一个`.ative`样式，用于修改激活选项卡的样式。

```css
.active {
    color: white;
    background: green;
}
```

完善Tab组件：

```javascript
Tab.prototype.showItem = function (n) {

    var i;
    for (i = 0; i < this._tabContents.length; i++) {
        this._tabContents[i].style.display = 'none';
    }
    this._tabContents[n].style.display = 'block';

    if (this._currentClass) {
        var currentMenu = this._root.getElementsByClassName(this._currentClass)[0];
        if (currentMenu) {
            removeClass(currentMenu, this._currentClass);
        }
        addClass(this._tabMenus[n], this._currentClass);
    }

};
```

我们增加了`removeClass`和`addClass`两个辅助方法，分别用于给指定的dom节点删除和增加样式。

使用方法上，我们增加了一个`currentClass`来供用户自定义激活选项卡的样式。

```javascript
new Tab({
    root: tabs[1],
    currentClass: 'active'
});
```