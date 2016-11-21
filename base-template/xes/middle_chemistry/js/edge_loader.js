/**
* 初中化学
* edge加载
* @thinlong
* v1.0 2016.9.21
* 功能:
* 判断资源包路径，加载js、css文件
*/

//全局变量
var path = filePath;
console.log("资源包路径:" + path);

yepnope({

	 //加载地址
    both:[
    	path + "js/jquery.min.js",    	
    	path + "css/preload.min.css",
    	path + "css/edge_common.css",
    	path + "js/preload.min.js",
    	path + "js/edge_common.js"
    ],
		
	 //加载回调	
    callback: function(fileURL) {
    	console.log('加载完毕' + fileURL);
    },
    
	 //加载完毕回调	   
    complete: function(){
    	console.log('资源包全部加载完成');
    }
});    
