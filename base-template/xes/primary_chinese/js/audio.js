$(document).ready(function(){
	var Audio = document.createElement("audio");
	function myScroll() {
    //前边是获取chrome等一般浏览器,就用ie的办法获取
    	var x = document.body.scrollTop || document.documentElement.scrollTop;
    	var timer = setInterval(function() {
        	x = x - 100;
        	if(x < 100) {
            	x = 0;
            	window.scrollTo(x, x);
            	clearInterval(timer);
       	 }
        	window.scrollTo(x, x);
   	 	}, "10");
	}
	/*带有答案按钮的弹框和音频设置*/
	/* 点击科学驿站弹出弹窗*/
	$(".scienceStation").click(function(){
		myScroll();
		$(".daan_page").css("display","block");
		$(".daan_page .page_content").css("display","block");
			/*音频导入设置*/
        	Audio.src="yinpin/"+$(".page_content").attr("name");
        	Audio.play();
	});
	/*点击关闭按钮关闭弹窗*/
	$(".page_remove").click(function(){
		$(".daan_page").css("display","none");
		Audio.pause();
	});
});

