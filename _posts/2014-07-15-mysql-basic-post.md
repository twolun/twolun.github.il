---
layout: post
title: MySql安装配置及使用入门
category: knowledge
---

众所周知，MySql是个开源的关系型数据库，目前MySQL分为两个版本，商业版与社区版。其中社区版是免费提供的。下面简单介绍mysql的配置及简单使用入门。
<!--more-->

## 安装与配置

因此我们只需到[官网下载](http://dev.mysql.com/downloads/mysql/)`community server`即可，直接下载免安装版，能够非常便捷的配置与使用。

1. 进入mysql主目录（建议将其移到C或D盘的根目录，并改名为mysql)

2. 配置path环境变量（如c:\mysql\bin\）添加到环境变量中。

3. mysql主目录下的my-default.ini文件改名为my.ini，最简单配置如下

		[mysqld]
	
		# Remove leading # and set to the amount of RAM for the most important data
		# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
		# innodb_buffer_pool_size = 128M
		
		# Remove leading # to turn on a very important data integrity option: logging
		# changes to the binary log between backups.
		# log_bin
		
		# These are commonly set, remove the # and set as required.
		basedir = c:/mysql
		datadir = c:/mysql/data
		port = 3306
		# server_id = .....

	（即去掉注释，并填写参数）

4. 在命令行中执行如下命令： 导航到mysql的根目录并执行命令（你需要有管理员权限）

		mysqld install mysql --defaults-file="c:\mysql\my.ini"

	若被命令执行失败，则使用管理员身份打开cmd窗口。

5. 在命令行中启动Mysql服务

		net start mysql

6. 默认情况下无密码，使用如下命令进入mysql

		mysql -u root


7. 初次使用为root用户更改密码的话，使用如下命令

		mysqladmin -u root password
		#輸入你的新密碼
		#然後
		mysql -u root -p 新密碼

## 基本用法

下面主要简单说一下MySQL在使用过程中的一些使用技巧。安装好mysql后可以在环境变量的path变量中添加一下mysql主目录下的bin目录的路径，这样就可以通过在CMD中直接使用mysql命令。

1. 配置好mysql的环境变量后，可以使用如下命令在命令行中进入mysql：

	启动前使用如下命令启动mysql : 
	
		net start mysql

	关闭mysql的指令为: 
	
		net stop mysql

	可以在CMD中或者运行界面使用上面的命令。

	使用如下命令进入mysql:
	前提是配置好环境变量，在Path变量中加入mysql下的bin目录路径

		mysql -u root -p
		>>提示输入密码

2. 在mysql中常用的操作有如下一些：
	
		mysql >
				exit //退出mysql
				show databases;  //显示已有数据库
				use 数据库名; //进入指定的数据库
				show tables; //显示数据中的表
						
				select * form TableName;
						
				//创建数据库	
				create database mydb1;
				create database mydb1 character set UTF8; //指明编码方式为utf-8
								
				show variables like 'character%'  //查看当前平台中的可用字符编码
					
				//---- 以下两个为mysql独有操作 ---
				//数据库备份
				mysqldump -u root -p mydb2 > d:\mydb2.sql  回车
						
				//数据库恢复
				source d:\mydb2.sql

	具体关于mysql中特有的操作可以阅读mysql的参考手册。（网上可以下chm版）

3. mysql中的常用数据类型：

	- Date  使用 `yyyy-MM-dd` 作为定界符，如`2013-11-11`,对于日期类型，mysql数据库有一定的判断功能
	- Datetime  含时分秒 '2013-11-11 20:59:30',若不输入时分秒，默认为 00:00:00
	- Timestamp 时间戳，默认直接使用当前操作的时间  //常用
	- char 固定长度字符串
	- varchar 可变长度字符串
	- Text  大于65536字符的数据
	- Blob  存储二进制多媒体数据，例如Mp3等。该二类型都有四个子类型，根据存储内容的大小进行选择
	
		例如：
	
			create table user (
				id int,
				name varchar(20),
				pwd varchar(6),
				birthday timestamp,
				memo text,
				photo blob
			);

4. mysql的数据库引擎

	关于Mysql的数据库引擎，早期使用的是MyISAM，但其不支持多表查询功能。因此目前主要使用InnoDB作为数据库引擎，其支持事务安全。InnoDB给MySQL提供了具有transcation\rollback\crash recovery\ACID等功能。
	
	在MySQL的主文件夹中，有一个文件值得一提。就是`my.ini`，在这个文件中我们可以设置客户端端口号、设置客户端默认编码、以及服务端的默认编码。对于免安装版，这个文件非常的重要。
	
	关于mysql的具体使用其实和sql并没有太大差异，但其拥有很多特色的功能函数，能够非常便捷的简化许多的开发操作，建议可以读读mysql的文档。

## References

1. Download: http://dev.mysql.com/downloads/mysql/
2. Documentation: http://dev.mysql.com/doc/