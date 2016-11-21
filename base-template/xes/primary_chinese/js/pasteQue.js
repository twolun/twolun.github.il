/*
 * 小高粘题js
 * siyao
 * 2016 9 29
 */

$(document).ready(function() {

	var index = 0;
	var li_enabled = false;

	initPasteQue();

	li_enabled = chenckLiToShow($(".pasteQue_ul li:nth-child(1)"));
	if(li_enabled) {
		judgeIndexToHideBtn($(".tabPage").eq(0));
	} else {
		$(".tabPage").eq(0).children(".innerPage").css("display", "block");
	}

	function initPasteQue() {
		var len = $(".tabPage").length;
		for(var i = 0; i < len; i++) {
			$(".tabPage").eq(i).children(".innerPage").eq(0).css("display", "block");
		}
		
	}
	
//	$(".demon_Btn").get(0).hasEventListener();
	
	$(".scienceStation").click(function(){
		if( !$(this).hasClass("scienceStationOpen") )
		{
			$(this).addClass( "scienceStationOpen" );
		}
		else {
			$(this).removeClass( "scienceStationOpen" );
		}
		
	});
	/* 三角移动  */
	function posTriangle(num) {

	}

	function chenckLiToShow($li) {
		var enabled = false;
		if($li.text().substr(0, 1) == "例") {
			$(".nextQueBtn").hide();
			$(".prevQueBtn").hide();

			enabled = false;
		} else {
			enabled = true;
		}
		return enabled;
	}
	$(".pasteQue_ul li").click(function() {
		console.log( $(this).css("z-index") );
		console.log( $(".horLine").css("z-index") )
		$(this).siblings().children("span").removeClass("selected");
		$(this).children("span").addClass("selected");
		$(this).addClass("selected").siblings().removeClass("selected");

		//内容
		var tabPages = $(".content-text").children(".tabPage");
		tabPages.hide();
		index = $(this).index();
		var tab = tabPages.eq(index);
		tab.show();
		//判断是否显示翻页按钮
		li_enabled = chenckLiToShow($(this));
		if(li_enabled) judgeIndexToHideBtn(tab);

		//		posTriangle(index);

	});
	

	$(".nextQueBtn").click(function() {
		$(".prevQueBtn").show();

		var inners = $(".tabPage:visible").children(".innerPage");
		var innerVisible = $(".tabPage:visible").children(".innerPage:visible");
		var len = inners.length;
		if(len != 0) {
			var innerIndex = inners.index(innerVisible);
			innerIndex++;
			innerVisible.hide();
			var currentInner = inners.eq(innerIndex);
			currentInner.show();

			if(innerIndex >= len - 1) {
				$(this).hide();
			}
		}
	});

	function judgeIndexToHideBtn($tab) {
		var inners = $tab.children(".innerPage");
		var innerVisible = $(".tabPage:visible").children(".innerPage:visible");
		var len = inners.length;
		var innerIndex = inners.index(innerVisible);
		if(len <= 1) {
			$(".nextQueBtn").hide();
			$(".prevQueBtn").hide();
		} else if(innerIndex >= len - 1) {
			$(".prevQueBtn").show();
			$(".nextQueBtn").hide();
		} else if(innerIndex <= 0) {
			$(".nextQueBtn").show();
			$(".prevQueBtn").hide();
		} else {
			$(".prevQueBtn").show();
			$(".nextQueBtn").show();
		}

	}

	$(".prevQueBtn").click(function() {
		$(".nextQueBtn").show();

		var inners = $(".tabPage:visible").children(".innerPage");
		var innerVisible = $(".tabPage:visible").children(".innerPage:visible");
		var len = inners.length;
		if(len != 0) {
			var innerIndex = inners.index(innerVisible);
			innerIndex--;
			innerVisible.hide();
			var currentInner = inners.eq(innerIndex);
			currentInner.show();

			if(innerIndex <= 0) {
				$(this).hide();
			}
		}
	});
	
	$(".demon_Btn").click(function() {

		var idStr = $(this).siblings(".demonstration").find("canvas").attr("id");
		try {
			createjs;
			animaCreateJs;
			exist = true;
		} catch(e) {
			exist = false;
		}

		if(!exist) {
			if($(this).children(".arrowRight").hasClass("arrowRight_cur")) {
				$(this).children(".arrowRight").removeClass("arrowRight_cur");
			} else {
				$(this).children(".arrowRight").addClass("arrowRight_cur");
			}

		} else {
			var arr = animaCreateJs.prototype.animationArr;
			if(arr.length != 0) {
				var canvasIndex = animaCreateJs.prototype.getIndexById(idStr);
				if(!isNaN(canvasIndex) && canvasIndex <= arr.length) {
					var animaObj = animaCreateJs.prototype.animationArr[canvasIndex];
					var anima = animaObj["anima"];

					if($(this).children(".arrowRight").hasClass("arrowRight_cur")) {

						$(this).children(".arrowRight").removeClass("arrowRight_cur");
						anima.stop();
					} else {
						$(this).children(".arrowRight").addClass("arrowRight_cur");
						anima.gotoAndPlay(0);
					}
				} else {
					console.log('idnex索引无效 或 索引超范围');
				}
			}
		}

		$(this).siblings(".demon_origin").toggle(300);
		$(this).siblings(".demonstration").toggle(300);
		var $parent = $(this).parent().parent();
		if($parent.get(0).className == "innerPage") {
			var $innerpage = $parent.siblings(".innerPage");
			if($innerpage.length > 0) {
				$innerpage.toggle(300);
			}
		}

	});
	
	

});