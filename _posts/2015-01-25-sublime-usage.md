---
layout: post
title: Sublime Text常用配置技巧与插件
category: technique
---

对不想使用大型IDE进行开发的开发者而言，使用类似于Sublime或Notepad++这类的文本工具往往能够带来更轻松的开发体验。Sublime Text是一款非常出色的文本工具，尤其对开发者而言，其拥有方便的配置选项，丰富的插件功能。我使用Sublime Text已经有一年多的时间了，本文将会总结Sublime Text的一些常用的设置技巧，一些常用的插件。

<!--more-->

###安装

[Sublime Text](http://www.sublimetext.com/)是一款免费的文本工具，下载安装后会定期提示你购买此软件，但如果你选择不购买，并不会影响该软件的正常使用（大爱）。安装方法很简单，只需要去官网下载对应的版本直接安装即可。

此外，你可以选择安装插件包管理工具来方便的进行插件的安装。对于初用Sublime的用户而言，推荐阅读Rob Dodson的[一篇文章](http://robdodson.me/sublime-text-2-tips-and-shortcuts/)。

###Package Manager
插件管理器的作用顾名思义就是用来进行插件的管理、安装及升级操作。它让你能够轻松的应对一些插件的管理工作，因此强烈建议你使用该工具来进行插件的管理。

打开Sublime后，选择 `Views -> Show Console`菜单（或按快捷键`ctrl + ``）启动终端窗口。打开后，你可以将下面的代码粘贴到终端输入框中。下面的代码对应的是Sublime Text2。Sublime Text3的用户参照[这篇文章](https://packagecontrol.io/installation#st3)。

> import urllib2,os,hashlib; h = '2deb499853c4371624f5a07e27c334aa' + 'bf8c4e67d14fb0525ba4f89698a6d7e1'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler()) ); by = urllib2.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); open( os.path.join( ipp, pf), 'wb' ).write(by) if dh == h else None; print('Error validating download (got %s instead of %s), please try manual install' % (dh, h) if dh != h else 'Please restart Sublime Text to finish installation')

上面的的代码会创建相应的插件管理文件夹，然后下载`Package Control.sublime-package`到该文件夹。安装完插件管理器后，你就可以轻松的安装你想要的插件了。

###常用配置
在安装插件之前，我们先来配置一下Sublime的常用配置项，例如用户界面、缩进、字体等等。在菜单栏选择`Preferences -> Setting-User`，会打开一个配置文件，该文件使用JSON格式进行书写。常用配置项如下，你可以直接复制粘贴到该文件中，然后保存该文件。

	{
		"auto_complete": false,
		"auto_complete_commit_on_tab": false,
		"color_scheme": "Packages/Color Scheme - Default/Monokai.tmTheme",
		"draw_minimap_border": true,
		"draw_white_space": "all",
		"font_face": "Consolas",
		"font_size": 14.0,
		"highlight_line": true,
		"highlight_modified_tabs": true,
		"ignored_packages":
		[
			"Vintage",
			"LiveStyle"
		],
		"line_padding_bottom": 1,
		"line_padding_top": 1,
		"save_on_focus_lost": true,
		"tab_size": 4,
		"translate_tabs_to_spaces": true,
		"trim_trailing_white_space_on_save": true,
		"word_wrap": false
	}

###安装插件
插件能够让你的工作更加的高效，Sublime拥有非常丰富的插件库。通过插件管理器，我们能够非常使用非常简单的方法管理和配置插件。

1. 在Sublime中，打开插件管理器（`ctrl+shift+p`）
2. 输入`Install Package`
3. 输入你想要的插件名称进行检索，选中想要的项按回车直接进行安装。

Sublime的插件列表可以在下面的链接中查看：[https://packagecontrol.io/browse](https://packagecontrol.io/browse)

对前端开发者而言，常用的插件包括：

- HTML-CSS-JS Prettify
- Autoprefixer
- Gutter Color
- ColorPicker
- Emmet
- Git Gutter

你可以通过Google Developer的一篇[介绍文章](https://developers.google.com/web/fundamentals/tools/setup/editor#install-plugins)查看这些插件的作用。

####安装HTML-CSS-JS Prettify
这里我们简单介绍一下`HTML-CSS-JS Prettify`插件。这个插件能够让你方便的美化的前端代码格式。该插件的项目地址为：https://github.com/victorporof/Sublime-HTMLPrettify

使用方法如下：
使用`Ctrl+shift+p`打开插件管理器，然后输入`htmlprettify`，确认后即可将当前页面的前端代码格式化（美化、缩进）。

####安装Soda主题
Soda主题应该是Sublime社区非常流行的一套主题，具有黑色和白色两种表现形式。其项目地址如下：http://buymeasoda.github.io/soda-theme/

下面我们使用插件管理器来安装该插件（针对Sublime Text2版本，版本3请参照官方文档）。在安装插件的第3步输入`Theme - Soda`然后安装即可，你可以选择安装默认版或黑色版的主题。接下来在`Setting-User`中配置该主题，添加如下的配置项：

	"theme": "Soda Dark.sublime-theme",
	"soda_folder_icons": true

这里我们启用了Soda的黑色版皮肤，并使用Soda的文件夹样式。配置完后重启Sublime即可。另外，推荐你安装Soda官方推荐的颜色方案。具体操作可以参考[链接页面](https://packagecontrol.io/packages/Theme%20-%20Soda)的Bonus Option一栏的步骤。这里不赘述。

###设定快捷键

其次，你可能想要做的就是设定Sublime的快捷键。这项设置位于`Preferences > Key Bindings - User`，你可以在其中添加你自定义的快捷键设置。

###To be continued...