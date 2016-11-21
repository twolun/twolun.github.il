/*
 * 动画下一步下一步控制
 */
$(document).ready(function() {

	/**
	 * canvasId 从canvas1开始命名
	 */
	$(".animaContrl .playBtn").click(function() {
		var canvasId = $(this).siblings().get(0).id;

		var animaIndex = animaCreateJs.prototype.getIndexById(canvasId);
		var animaObj = animaCreateJs.prototype.animationArr[animaIndex];
		var anima = animaObj["anima"];

		if(anima.currentFrame == anima.totalFrames) {
			anima.gotoAndPlay(0);
		} else {
			anima.play();
		}
		$(this).hide();
		anima.addEventListener("tick", animaPlaying);

	});
	/**
	 * 动画 上一步 下一步 控制 按钮停靠页面底部
	 * 只能控制1个canvas动画
	 */
	$(".next-btn.animaBtn ").click(function() {
		var canvasId = $(".animaContrl").children("canvas").attr("id");

		var animaIndex = animaCreateJs.prototype.getIndexById(canvasId);
		var animaObj = animaCreateJs.prototype.animationArr[animaIndex];

		searchForNextLabel($(this), $(this).siblings(".prev-btn"), animaObj["anima"]);
	});
	$(".prev-btn.animaBtn ").click(function() {
		var canvasId = $(".animaContrl").children("canvas").attr("id");
		var animaIndex = animaCreateJs.prototype.getIndexById(canvasId);
		var animaObj = animaCreateJs.prototype.animationArr[animaIndex];
		searchForPrevLabel($(this), $(this).siblings(".next-btn"), animaObj["anima"]);
	});

	/**
	 * 动画 上一步 下一步 控制  按钮跟随canvas画布后面
	 * 适用页面多个动画需控制的情况
	 */
	$(".animaContrl .btnStyle:first").click(function() {
		var btnIndex = $(this).parent().children(".btnStyle").index($(this));

		var canvasId = $(this).parent().children("canvas").attr("id");
		var animaIndex = animaCreateJs.prototype.getIndexById(canvasId);
		var animaObj = animaCreateJs.prototype.animationArr[animaIndex];
		searchForPrevLabel($(this), $(this).siblings("[name='nextBtn']"), animaObj["anima"]);
	});

	$(".animaContrl .btnStyle:last").click(function() {
		var btnIndex = $(this).parent().children(".btnStyle").index($(this));

		var canvasId = $(this).parent().children("canvas").attr("id");
		var animaIndex = animaCreateJs.prototype.getIndexById(canvasId);
		var animaObj = animaCreateJs.prototype.animationArr[animaIndex];
		searchForNextLabel($(this), $(this).siblings("[name='prevBtn']"), animaObj["anima"]);

		//anima.addEventListener( "tick",animaPlaying );
	});
	/**
	 * 动画播放器 带外框 上下步 带全屏
	 */

	// 控制条自动隐藏
	//	$(".animaController .contrlBar").mouseover(function(event) {
	//		$(this).stop().animate({
	//			opacity: '1'
	//		});
	//		//.log( "over:", event.target.className );
	//	});
	//	$(".animaController .contrlBar").mouseout(function(event) {
	//
	//		//.log( "out:", event.relatedTarget.className );
	//		//.log( "out:", event.target.className );
	//
	//		var related = event.relatedTarget;
	//		var arr = related.className.split(" ");
	//		var len = arr.length;
	//		var str = "";
	//		for(var i = 0; i < len; i++) {
	//			if(arr[i] != "") {
	//				str += ("." + arr[i]);
	//			}
	//		}
	//
	//		var outCollect = $(this).has(str);
	//		if(outCollect.length == 0) {
	//			$(this).stop().animate({
	//				opacity: '0'
	//			});
	//		}
	//
	//	});

	$(".animaController .playBtn").mousedown(function() {
		//.log("playBtn mousedown")

		if($(this).hasClass("playBtn")) {
			$(this).addClass("playBtnPress");

		} else {
			$(this).addClass("pauseBtnPress");
		}

	});
	$(".animaController .playBtn").mouseup(function() {

		//.log("playBtn mouseup");

		var canvasId = $(this).parent().siblings("canvas").attr("id");

		var animaIndex = animaCreateJs.prototype.getIndexById(canvasId);
		var animaObj = animaCreateJs.prototype.animationArr[animaIndex];

		var anima = animaObj["anima"];

		anima.removeEventListener("tick", animaControllerStepPlaying);

		$(".animaController").find(".nextStepBtn").css("visibility", "visible");
		$(".animaController").find(".prevStepBtn").css("visibility", "visible");

		if($(this).hasClass("playBtn")) {
			$(this).removeClass("playBtn");
			$(this).removeClass("playBtnPress");
			$(this).addClass("pauseBtn");

			if(anima.currentFrame == anima.totalFrames) {
				anima.gotoAndPlay(0);
			} else {
				anima.play();
			}
			anima.addEventListener("tick", animaControllerPlaying);
		} else {
			$(this).removeClass("pauseBtn");
			$(this).removeClass("pauseBtnPress");
			$(this).addClass("playBtn");
			anima.stop();
			anima.removeEventListener("tick", animaControllerPlaying);
		}
	});
	//以下2个方法无效 没有使用
	$(".animaController .pauseBtn").mousedown(function() {
		//.log(" pauseBtn , mousedown");
		$(this).addClass("pauseBtnPress");
	});

	$(".animaController .pauseBtn").mouseup(function() {
		//.log("pauseBtn mouseup");
		$(this).removeClass("pauseBtnPress");
		$(this).removeClass("pauseBtn");
		$(this).addClass("playBtn");
		anima.stop();

	});
	$(".animaController .prevStepBtn").mousedown(function() {

		$(this).addClass("prevStepBtnPress");

	});
	$(".animaController .prevStepBtn").mouseup(function() {

		$(this).removeClass("prevStepBtnPress");

		var canvasId = $(this).parent().siblings("canvas").attr("id");

		var animaIndex = animaCreateJs.prototype.getIndexById(canvasId);
		var animaObj = animaCreateJs.prototype.animationArr[animaIndex];

		var anima = animaObj["anima"];
		anima.stop();
		searchForPrevLabel($(this), $(this).siblings(".nextStepBtn"), anima);
		anima.removeEventListener("tick", animaControllerPlaying);
		anima.removeEventListener("tick", animaControllerStepPlaying);

	});
	$(".animaController .nextStepBtn").mousedown(function() {

		$(this).addClass("nextStepBtnPress");

	});
	$(".animaController .nextStepBtn").mouseup(function() {
		$(this).removeClass("nextStepBtnPress");

		var canvasId = $(this).parent().siblings("canvas").attr("id");

		var animaIndex = animaCreateJs.prototype.getIndexById(canvasId);
		var animaObj = animaCreateJs.prototype.animationArr[animaIndex];

		var anima = animaObj["anima"];
		anima.stop();

		searchForNextLabel($(this), $(this).siblings(".prevStepBtn"), anima);

		$(".animaController .playBtn ").removeClass("playBtn").addClass("pauseBtn");

		anima.removeEventListener("tick", animaControllerPlaying);
		if(!anima.hasEventListener("tick")) {
			//.log( "添加侦听" );
			anima.addEventListener("tick", animaControllerStepPlaying);
		}

	});
	var $fullAnimaDiv;
	var full = false;
	$(".fullBtn").click(function() {
		$fullAnimaDiv = $(this).parent().parent();

		if(full) {
			full = false;
			existAnimaFull();
		} else {
			full = true;
			enterAnimaFull();
		}
	});
	var $fullOriginalParent;

	function enterAnimaFull() {
		var docElm = document.documentElement;
		//		launchFullscreen(docElm);
		var winW = docElm.clientWidth; //document.body.clientWidth
		$(".wrap").hide();
		//测试
		//		$fullAnimaDiv.remove();
		$fullOriginalParent = $fullAnimaDiv.parent();
		$fullAnimaDiv.appendTo($("body"));

		$fullAnimaDiv.addClass("fullAnima");
		$fullAnimaDiv.css({
			width: winW
		});
		var $canvas = $fullAnimaDiv.children("canvas");
		var canvasHeight = $canvas.height();
		$fullAnimaDiv.css("height", canvasHeight / conversionRatio + "rem");
		var $controlBar = $fullAnimaDiv.children(".contrlBar");
		var topPos = ($canvas.offset().top + canvasHeight - $controlBar.height()) / conversionRatio;
		$controlBar.css("top", topPos.toFixed(1) - 0.01 + "rem");
	}
	//	$(document).keydown(function(event) {
	//		if(event.keyCode == 27) {
	//			existAnimaFull();
	//			full = false;
	//		}
	//	});

	function existAnimaFull() {
		if($fullAnimaDiv != null) {
			$(".wrap").show();
			$fullOriginalParent.append($fullAnimaDiv);
			$fullOriginalParent = null;
			$fullAnimaDiv.removeClass("fullAnima");
			$fullAnimaDiv.css({
				width: "7.2rem",
				height: "4rem"
			});

			var $canvas = $fullAnimaDiv.children("canvas");
			var $controlBar = $fullAnimaDiv.children(".contrlBar");

			var topPos = ($canvas.position().top + $canvas.height() - $controlBar.height()) / conversionRatio;
			$controlBar.css("top", topPos + "rem");

			$fullAnimaDiv = null;
		}
	}
	$(window).resize(function() {
		console.log("resize");

		if(full) {
			enterAnimaFull();
		}
	});

	function launchFullscreen(element) {
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}
	/**
	 * 动画控制器播放 连续播放
	 * @param {Object} evt
	 */
	function animaControllerPlaying(evt) {

		//.log( "Playing" );

		var anima = evt.currentTarget;
		if(anima.currentFrame == anima.totalFrames) {
			console.log("完结");
			anima.removeEventListener("tick", animaControllerPlaying);
			$(".animaController").find(".playBtn").removeClass("pauseBtn").addClass("playBtn");
			$(".animaController").find(".pauseBtn").removeClass("pauseBtn").addClass("playBtn");
			//播放按钮变化  下一步按钮变化
			$(".animaController").find(".nextStepBtn").css("visibility", "hidden");
		}
	}
	var stepIndex = 0;
	/**
	 * 动画控制器播放 上下步播放
	 * @param {Object} evt
	 */
	function animaControllerStepPlaying(evt) {

		//.log( "StepPlaying" );

		var anima = evt.currentTarget;
		var labelArr = anima.labels;
		var len = labelArr.length;
		var obj;
		if(stepIndex == len - 1) {
			if(anima.currentFrame == anima.totalFrames) {
				anima.stop();
				$(".animaController .pauseBtn ").removeClass("pauseBtn").addClass("playBtn");
				//.log( "stepIndex:",stepIndex ,"移除"  );
				anima.removeEventListener("tick", animaControllerStepPlaying);
			}
		} else {
			obj = labelArr[stepIndex + 1];
			if(anima.currentFrame == obj["position"]) {
				anima.stop();
				$(".animaController .pauseBtn ").removeClass("pauseBtn").addClass("playBtn");
				//.log( "stepIndex:",stepIndex ,"移除"  );
				anima.removeEventListener("tick", animaControllerStepPlaying);
			}
		}

	}
	//下一个或者播放
	function searchForNextLabel($nextBtn, $prevBtn, anima) {
		$prevBtn.css("visibility", "visible");
		var currentFrame = anima.currentFrame;
		var labelArr = anima.labels;
		var len = labelArr.length;
		var obj;
		for(var i = 0; i < len; i++) {
			obj = labelArr[i];
			if(obj["position"] >= currentFrame) {
				if(i == len - 1) {
					$nextBtn.css("visibility", "hidden");
				}
				stepIndex = i;
				anima.gotoAndPlay(obj["position"] + 1);
				break;
			}
		}

	}
	//上一步 
	function searchForPrevLabel($prevBtn, $nextBtn, anima) {
		$nextBtn.css("visibility", "visible");
		var currentFrame = anima.currentFrame;
		var labelArr = anima.labels;
		var len = labelArr.length;
		var obj;
		for(var i = len - 1; i >= 0; i--) {
			obj = labelArr[i];
			if(obj["position"] < currentFrame) {
				if(i == 0) {
					stepIndex = i;
					anima.gotoAndStop(obj["position"]);
					$prevBtn.css("visibility", "hidden");
				} //写这里
				else {
					stepIndex = i;
					obj = labelArr[i];
					anima.gotoAndStop(obj["position"]);
				}
				break;
			} else {}
		}

	}

	function animaPlaying(evt) {
		var anima = evt.currentTarget;
		var canvasElement = animaCreateJs.prototype.getCanvasByAnima(anima);
		if(anima.currentFrame == anima.totalFrames) {
			console.log(111);
			anima.removeEventListener("tick", animaPlaying);
			//			canvas.siblings(".playBtn").show();
			var nodes = canvasElement.parentNode.childNodes;
			var len = nodes.length;
			for(i = 0; i < len; i++) {
				console.log(nodes[i].className);
				if(nodes[i].className == "playBtn") {
					nodes[i].style.display = "block";
					break;
				}
			};
		}
	}

});