---
layout: post
title: 为Jekyll站点添加Swiftype站内搜索
category: technique
---

博客之前使用的是Google的本地搜索，但随着外网访问Google越来越不稳定，因此趁着博客这次改版，将博客的站内搜索也换了一个。 这里，偶然间看到了这个叫`swiftype`的站内搜索引擎，这里也推荐一下。Swiftype的官方网址如下：

<!--more-->

	https://swiftype.com/

值得一提的是swiftype支持自动补全，搜索结果支持分页。swiftype有免费的版本，因此我们只要使用免费的版本即可。 安装swiftype的过程非常简单，只要简单的几步就可以设置好。

1. 验证域名有效性，并为你的站内搜索设置想要的名称
2. 创建你的swiftype账号
3. 在你的博客中配置相关的输入表单与搜索结果域

具体参见下面的步骤：

####创建搜索输入框

	<form class="navbar-form navbar-right" _lpchecked="1">
      	<input type="text" id="st-search-input" class="form-control col-md-8" placeholder="Search">
    </form>

####创建搜索结果域
	
	<div id="st-results-container" class="post search-result"></div>

这里swiftype允许你设置覆盖、当前页面、新页面三种方式展现搜索结果。

####粘贴swiftype站内搜索代码

	<script>
	  (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
	  (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
	  e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.insertBefore(s,e);
	  })(window,document,'script','//s.swiftypecdn.com/install/v1/st.js','_st');
	
	  _st('install','MiJBeFgrm3tLR7NBki2m');
	</script>

至此，基于swiftype的本地搜索就搭建成功了。