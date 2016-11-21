/*
 * 小学数学  
 * edge通用的js
 * @thinlong
 * v1.0 2016.9.18
 * 功能：备用
 * 
 * v1.1
 * 2016.10.9
 * 添加根据浏览器尺寸缩放功能
 * 
 * v1.2
 * 添加显示隐藏弹出面板
 * 添加resize侦听
 */

 var myStyle = document.createElement("style");
 var html = "";
 var zoomFactor = document.documentElement.clientWidth/1024;
 html += "html{zoom:" + zoomFactor + "}";
 myStyle.innerHTML  = html;
 document.head.appendChild(myStyle);
 
/*显示面板*/
showPopPanel = function(){
	$("#Stage").css('overflow-y', 'hidden');	
	//显示遮罩
	$("#Stage_mask").css('visibility', 'visible');

	var panel = $("#Stage_popPanel");
	panel.css('visibility', 'visible');
	

	//获取屏幕宽高
	var screenWidth = $(window).width();	
	var screenHeight = $(window).height();  
	//当前窗口距离页面顶部的距离
	var scollTop = $('#Stage').scrollTop();  
	///弹出框距离左侧距离    
	var objLeft = ($('#Stage').width() - panel.width()) / 2;   
	///弹出框距离顶部的距离
	var objTop = (screenHeight - panel.height()*zoomFactor) / 2 + scollTop;  
	console.log("(" + screenHeight + " - " + panel.height() + "*" + zoomFactor + ")/2 + " + scollTop); 
	panel.css({  
		left:objLeft + "px",  
		top:objTop + "px"  
	});
	
	$('#Stage_popPanel').addClass('animated bounceIn');
}

/*隐藏面板*/
hidePopPanel = function(){
	$("#Stage").css('overflow-y', 'auto');
	$("#Stage_mask").css('visibility', 'hidden');
	var panel = $("#Stage_popPanel");
	panel.css('visibility', 'hidden');
	$('#Stage_popPanel').removeClass('bounceIn');
}

$(document).ready(function(){
    $(window).resize(function() {
	    zoomFactor = document.documentElement.clientWidth/1024;
	    console.log(zoomFactor);
 		$("html").css('zoom', zoomFactor);
	});
})