/**
 * h5切片通用加载器
 * 初中数学
 * @thinlong
 * v1.0
 * 2016.9.21
 * 功能:判断是否存在资源包，如果存在加载资源包，如果不存在读取网络文件
 * v1.1 变更资源包网络地址
 * 
 * v1.2 
 * 2016.9.30
 * 功能:
 * 删掉了404判断
 * 增加了XMLHTTP不支持的提示    
 */

var loader_common = (function(){
function loader_common(){
	var index = 0;
	var files = [];
	var filePath;
	
	var tempCommonFile = [];
	var tempPrivateFile = [];
	
	var isReady = false;
	var canLoad = false;
	var isLoad = false;

	//判断资源读取的方式
	filePath = '../../xes/high_math/';
	var XMLHTTP;
	if (window.XMLHttpRequest) { 
		// code for IE7+, Firefox, Chrome, Opera, Safari
	    XMLHTTP = new XMLHttpRequest();
	} else { 
		// code for IE6, IE5
	    XMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	if(XMLHTTP == null)
	{
		alert("Your browser does not support XMLHTTP.");
	}
	else
	{
		XMLHTTP.open("GET",filePath + "js/flag.js",true);
		XMLHTTP.send(null);
	}
	
	XMLHTTP.onreadystatechange=function(){
	    if(XMLHTTP.readyState==4){ 	
	        if(XMLHTTP.status==200){
	            console.log("资源包js");
	        }else{
	            console.log("网络js")
	            filePath = 'http://kjds2.speiyou.com/courseware/xes/high_math/';
	        }
	        
	        console.log('文件夹地址:' + filePath);
	        
	        if(canLoad == true)
	        {
	        	if(isLoad == false)
	        	{
	        		isLoad = true;
	        		composeFiles();
	        		checkProcess();	  
	        	}
	        }
	        
	        isReady = true;
	    }
	}    
	
	//添加单个文件
	function addSingleFile(fPath)
	{
		var index = fPath.indexOf('.js');
		if(fPath.indexOf('.js') == fPath.length - 3)
		{
			console.log('加载js:' + fPath);
			addJs(fPath);
		}
		else if(fPath.indexOf('.css') == fPath.length - 4)
		{
			console.log('加载css:' + fPath);
			addCss(fPath);
		}
	}
	
	//添加js
	function addJs(jsPath)
	{
		var j1 = document.createElement('script');
		j1.src = jsPath;	
		document.body.appendChild(j1);
		j1.onload = function(){
			index++;
			checkProcess();
		}
	}
	
	//添加css
	function addCss(cssPath)
	{
		var c1 = document.createElement('link');
		c1.type = "text/css";
		c1.rel = "stylesheet";
		c1.href = cssPath;	
		document.body.appendChild(c1);	
	
		index++;
		checkProcess();
	}
	
	//判断进度
	function checkProcess(){
		if(index >= files.length)
		{
			console.log("资源全部加载完毕");
		}
		else
		{
			var filePath = files[index];
			addSingleFile(filePath);	
		}
	}
	
	
	this.addCommonFiles = function(fs){
		for(var i = 0; i < fs.length; i++)
		{
			var tempFile = fs[i];
			tempCommonFile.push(tempFile);
		}
		console.log("通用文件:" + tempCommonFile);
	}
	
	this.addPrivateFiles = function(fs){	
		tempPrivateFile = fs;
		console.log("自用文件:" + tempPrivateFile);
	}
	
	composeFiles = function(){
		for(var i = 0; i < tempCommonFile.length; i++)
		{
			var tempFileA = tempCommonFile[i];
			files.push(filePath + tempFileA);
		}
		
		for(var j = 0; j < tempPrivateFile.length; j++)
		{
			var tempFileB = tempPrivateFile[j];
			files.push(tempFileB);
		}
	}
	
	this.load = function(){				
		console.log("开始加载");
		
		if(isReady == true)
		{
			if(isLoad == false)
        	{
        		isLoad = true;
        		composeFiles();
        		checkProcess();	  
        	}
		}
		
		canLoad = true;
	}

}

return loader_common;
})();