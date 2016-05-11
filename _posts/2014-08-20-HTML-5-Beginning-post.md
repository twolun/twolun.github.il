---
layout: post
title: Beginning HTML5 New Features
category: technology
---
###New Features Added to HTML5

- Semantics: allowing you to describe more precisely what your content is.
- Connectivity: allowing you to communicate with the server in new and innovative ways.
- Offline & Storage: allowing webpages to store data on the client-side locally and operate offline more efficiently.
- Multimedia:
- 2D/3D
- Device Access: allowing for the usage of various input and output devices
<!--more-->
###New Semantics Tags
	
Semantic = Meaning.   
Semantic elements = Elements with meaning.   
A semantic element clearly describes its meaning to both the browser and the developer.

Examples of non-semantic elements: ***div and span*** - Tells nothing about its content.   
Examples of semantic elements: ***form, table, and img*** - Clearly defines its content.

HTML5 offers new semantic elements to clearly define different parts of a web page: ***header, nav, section, article, aside, figure, figcaption, footer, detail, summary, mark, time***. You can find detail from w3schools.com.   
The elements explained above are all block elements (except figcaption).

![HTML Semantic Tags](/img/posts/140826-sem-elements.gif)

###New Input Tags

	- Speech input: <input type="text" x-webkit-speech />
	- Required attribute: <input type="text" required />
	- Email input: <input type="email" value="some@email.com" />
	- Date input: <input type="date" min="2010-08-14" max="2011-08-14" value="2010-08-14"/>
	- Search Input: <input type="search" results="10" placeholder="Search..." />
	- Number input: <input type="number" step="1" min="-5" max="10" value="0" />

![HTML Input Tags](/img/posts/140826-input-tag.png)

###Conditional comments
This is a special type of comment, where based on conditions comments are executed, even though comments are ignorable.

	<!--[if lt IE 9]>
 	If IE is lesser than 9 do some thing     <![endif]-->

###Tips for Structuring Code
Use HTML5 Boilerplates, as it’s industry standard boilerplate template for the HTML5: 
	
	http://html5boilerplate.com/

as it includes all the basic setup and browser compatibility supports built in. 

###References

- http://www.codeproject.com/Articles/751542/Beginners-Guide-to-HTML-CSS-Building-the-Basics
- http://www.w3schools.com/html/html5_semantic_elements.asp
- http://www.codeproject.com/Articles/146409/Semantic-HTML5-Page-Layout