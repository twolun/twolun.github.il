---
layout: post
title: Beginning JQuery
category: technology
---
###Why JQuery
jQuery is a lightweight, "write less, do more", JavaScript library. The purpose of jQuery is to make it much easier to use JavaScript on your website. The jQuery library contains the following features:

- HTML/DOM manipulation
- CSS manipulation
- HTML event methods
- Effects and animations
- AJAX
- Utilities
<!--more-->
###Install JQuery
1.You can download all files from Jquery website, and import them to your website

2.You can use CDN to import Jquery Lib, e.g. Google, Miscrosoft

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

###Test and debug

1. using the debug tool provided by the browser
2. Right click in your web page, and then choose "Inspect Element"
3. Go and choose "Console"
4. In the command pad, you can input your Jquery code to test and debug
5. Check the JQuery function:

	$.fn.FUNCTION_NAME

6. Check the JQuery Selector:

	$("#id")

###Syntax

The jQuery syntax is tailor made for selecting HTML elements and performing some action on the element(s). Basic syntax is: ***$(selector).action()***

- A $ sign to define/access jQuery
- A (selector) to "query (or find)" HTML elements
- A jQuery action() to be performed on the element(s)

Examples:

- $(this).hide() - hides the current element.
- $("p").hide() - hides all ***p*** elements.
- $(".test").hide() - hides all elements with class="test".
- $("#test").hide() - hides the element with id="test".

####The Document Ready Event

	$(document).ready(function(){
   		// jQuery methods go here...
	});

This is to prevent any jQuery code from running before the document is finished loading (is ready). It is good practice to wait for the document to be fully loaded and ready before working with it. This also allows you to have your JavaScript code before the body of your document, in the head section.

The jQuery team has also created an even shorter method for the document ready event:

	$(function(){
   		// jQuery methods go here...
	});

###JQuery Selectors

jQuery selectors allow you to select and manipulate HTML element(s). jQuery selectors are used to "find" (or select) HTML elements based on their id, classes, types, attributes, values of attributes and much more. It's based on the existing CSS Selectors, and in addition, it has some own custom selectors. All selectors in jQuery start with the dollar sign and parentheses: $().

####More examples of Selectors
See more examples in w3shools.com:
**<http://www.w3schools.com/jquery/jquery_selectors.asp>**

####1. Element Selector

e.g. When a user clicks on a button, all **p** elements will be hidden:

	$(document).ready(function(){
	  $("button").click(function(){
	    $("p").hide();
	  });
	});

####2. ID Selector
The jQuery **#id** selector uses the id attribute of an HTML tag to find the specific element.

	$("#test")

####3. Class Selector
The jQuery class selector finds elements with a specific class. To find elements with a specific class, write a period character, followed by the name of the class:	

	$(".test")


###Popular Jquery Lib

####1.Bootstrap JS
<http://v3.bootcss.com/javascript/>

####2.DataTables
DataTables is a plug-in for the jQuery Javascript library. It is a highly flexible tool, based upon the foundations of progressive enhancement, and will add advanced interaction controls to any HTML table.

<http://www.datatables.net/>

####3.modernizr
Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.(Without denpendcy of Jquery)

<http://modernizr.com/>

####4.HighCharts
Powerful Chart lib with a large number of beautiful chats.

<http://www.hcharts.cn/>


###References
W3Schools.com Jquery: http://www.w3schools.com/jquery/default.asp