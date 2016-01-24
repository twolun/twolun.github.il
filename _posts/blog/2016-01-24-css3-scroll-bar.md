---
layout: post
title: CSS3控制滚动条样式
description: CSS3控制页面滚动条的样式大小等,webkit内核浏览器有效
category: blog
---

## 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸
```css  
::-webkit-scrollbar  
{  
    width: 0px;  
    height: 0px;  
    background-color: #F5F5F5;  
}  
```
  
## 定义滚动条轨道 内阴影+圆角
```html
::-webkit-scrollbar-track  
{  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}  
```
  
## 定义滑块 内阴影+圆角

    ::-webkit-scrollbar-thumb  
    {  
    border-radius: 10px;  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    





