/**
 * Created by se7en on 2016/8/23.
 * V.1.0.4
 * 1.修复：控制高度方法undefinde问题
 * 2.修改：题目底部横线滑动动画滑动方式
 * 3.修改：原题/解题切换滚轮重置
 * 4.修复bug：控制高度方法修改字符串
 */
function intenet() {
	if(navigator.onLine) {
		console.log("1");
	} else {
		console.log("2");
	}
}

//滚轮重置方法
function myScroll() {
	//前边是获取chrome等一般浏览器 如果获取不到就是ie了 就用ie的办法获取 
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

function linex(x) {
	if(m == 0) {
		$(".linex").stop();
		$(".linex").animate({
			left: "268px"
		}, 300);
	} else {
		$(".linex").stop();
		$(".linex").animate({
			left: "406px"
		}, 300);
	}
}
//空div高度控制
function height_control(y) {
	var x = y || "";
	x = parseInt(x.replace("px", "")) + 120;
	//$(".mengban_top2").css("margin-top", x - 30 + "px");
	$(".height_controler").css("height", x + "px");
}
var m = 0;
$(document).ready(function() {
	/*	原题解题切换按钮脚本*/

	$(".center-title span").click(function() {
		$(this).addClass("cur").siblings().removeClass("cur").children().addClass("curx").parent().siblings().children().removeClass();
		$(".tab-con").eq($(this).index()).fadeIn().siblings().hide();
		m = $(this).index();
		linex(m);
		height_control($(".p_container").children().eq(0).css("height"));
		myScroll();
	});

	/*原题解题滑动动画脚本*/
	$(".explain").click(function() {
			$(".linex").stop();
			$(".linex").animate({
				left: "406px"
			}, 300);
		})
		//	$(".explain").mouseout(function(){
		//		linex(m);
		//	})
	$(".original").click(function() {
			$(".linex").stop();
			$(".linex").animate({
				left: "268px"
			}, 300);
		})
		//	$(".original").mouseout(function(){
		//		linex(m);
		//	})

	/*	答案显示脚本 */
	$(".hide_p").click(function() {
		if($(this).attr("class") == "hide_p") {
			$(this).removeClass();
			$(this).addClass("hide_p cur");
		} else {
			$(this).removeClass();
			$(this).addClass("hide_p");
		}
	});
	/*底部按钮切换脚本*/
	$(".scroller button").click(function() {
			myScroll();
			$(this).addClass("btn-xur").siblings().removeClass("btn-xur");
			var x = $(this).index();
			x = (x + 2) / 2 - 1;
			$(".answer").children().eq(x).fadeIn().removeClass("no").siblings().hide().addClass("no");
			$(".scroll").children().eq(x).fadeIn().siblings().hide();
			height_control($(".p_container").children().eq(x).css("height"));

	})
	
	$(window).scroll(function() {
		if($(".mengban_top").css("display") == "none") {
			$(".mengban_bottom").fadeIn();
			$(".mengban_top").fadeIn();
			$(".mengban_top2").fadeIn();
			setTimeout(function() {
				$(".mengban_bottom").fadeOut();
				$(".mengban_top").fadeOut();
				$(".mengban_top2").fadeOut();
			}, 1000);
		}
	});
	/*底部按钮滑动动画脚本*/
	//	$("button").hover(function() {
	//		$(".btn-xur").stop();
	//		var x = $(this).index();
	//		x = x*43 + 14;
	//		$(".btn-xur").animate({
	//			left: x+ "px"
	//		});
	//	})
})