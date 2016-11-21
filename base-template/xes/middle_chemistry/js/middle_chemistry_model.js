(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        onResize = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth<=409.6){
                docEl.style.fontSize='40px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 800) + 'px';
                docEl.style.overflowX = 'hidden';
            }
        };
    var ready = false;
    if(ready == false){
        ready = true;
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        if(clientWidth<=409.6){
            docEl.style.fontSize='40px';
        }else{
            docEl.style.fontSize = 100 * (clientWidth / 800) + 'px';
            docEl.style.overflowX = 'hidden';
        }
    }
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, onResize, false);
    doc.addEventListener('DOMContentLoaded', onResize, false);
})(document, window);
//编辑模式下增加用到的js和css文件
function addEditFun(){
	var strVar = "";
//	strVar += "   <link href=\"css/bootstrap.min.css\" rel=\"stylesheet\">";
	strVar += "   <script src=\"js/bootstrap.min.js\"><\/script> ";
//	strVar += "   <link href=\"css/summernote.css\" rel=\"stylesheet\">";
	strVar += "   <script src=\"js/my_summernote.js\"><\/script>";
	strVar += "   <link href=\"http://kjds2.speiyou.com/courseware/xes/common/edit_model/bootstrap.min.css\" rel=\"stylesheet\">";
//	strVar += "   <script src=\"http://kjds2.speiyou.com/courseware/xes/common/edit_model/bootstrap.min.js\"><\/script> ";
	strVar += "   <link href=\"http://kjds2.speiyou.com/courseware/xes/common/edit_model/summernote.css\" rel=\"stylesheet\">";
//	strVar += "   <script src=\"http://kjds2.speiyou.com/courseware/xes/common/edit_model/my_summernote.js\"><\/script>";
	strVar += "   <script src=\"dist/lang/summernote-zh-CN.js\"><\/script>";
//	strVar += "   <script src=\"http://kjds2.speiyou.com/courseware/xes/common/edit_model/lang/summernote-zh-CN.js\"><\/script>";
	strVar += "   <link href=\"css/edit.css\" rel=\"stylesheet\">";
	strVar += "   <script src=\"js/summernote-ext.js\"><\/script>";//所有自定义按钮
	$($('head')[0]).append(strVar);
}
//生成预览模板时去掉多余的加载文件
function removeNode(){
	var arr = $("link")[0];arr.push($("script")[0]);
	for(var i = 0;i<arr.length;i++){
		var node = arr[i];
		if(node.nodeName=="SCRIPT" && node.outerHTML.indexOf('loader_common.js')<0 && node.outerHTML.indexOf('my_init.js')<0){
			node.remove();
		}
		if(node.nodeName=="LINK" && node.outerHTML.indexOf('first')<0){
			node.remove();
		}
	}
}

//用来获取选中什么文字就返回什么文字的方法
var funGetSelectTxt = function() {
    var txt = '';
    if(document.selection) {
        txt = document.selection.createRange().text;
    } else {
        txt = document.getSelection();
    }
    return txt.toString();
};
//whh 设置填空答案
function blank(){
	var range = $('.summernote').summernote('range');
	var dom = $('.summernote').summernote('dom');
	var editable = $('.summernote').summernote('editable');
	var Editor = $('.summernote').summernote('Editor'); 
	var beforeCommand = $('.summernote').summernote('beforeCommand'); 
	var afterCommand = $('.summernote').summernote('afterCommand'); 
	var style = $('.summernote').summernote('mystyle'); 
	
	var rng1 = range.create(editable).wrapBodyInlineWithPara();
 	var paras = rng1.nodes(dom.isPara, { includeAncestor: true });
 	var t = new Date().getTime();
 	
    var rng = Editor.createRange();
    if (rng && rng.isCollapsed()) {
      var spans = style.styleNodes(rng);
      var firstSpan = list.head(spans);
//		$(spans).addClass("answer");

      // [workaround] added styled bogus span for style
      //  - also bogus character needed for cursor position
      if (firstSpan && !dom.nodeLength(firstSpan)) {
        firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
        range.createFromNodeAfter(firstSpan.firstChild).select();
        $editable.data(KEY_BOGUS, firstSpan);
      }
    } 
    else {
      beforeCommand();
      $(style.styleNodes(rng)).wrap("<l class='line'></l>").addClass("answer answer_"+t);
//    if (paras.length === 1) {
//    	$(style.styleNodes(rng)).wrap("<l class='line'></l>").addClass("answer");
//    } else{
//    	$(style.styleNodes(rng)).wrap("<l class='line'></l>").addClass("answer answer_"+t);
//    } 
      $(".note-view button").eq(0).attr("disabled",true);//设置为答案之后按钮置灰
      $(".tooltip").hide();
      afterCommand();
    }
}
// 预览模式下增加显示答案
function addShowAnswerAndImg(){
	//控制填空答案的显示隐藏
	for (var i=0; i<$(".answer").length; i++) {
		if (($(".line").eq(i).parent().is("td")||$(".line").eq(i).parent().parent().is("td"))&&$(".line").eq(i).parent().text()==$(".line").eq(i).text()) {
			$(".line").eq(i).css("border",0);console.log($(".line").eq(i))
		}
	}
	$(".summernote").on("click",".answer",function(){
		if ($(this).css("opacity")==="0") {
//			if ($(this).attr("class").indexOf("_") === -1) {
//				$(this).css("opacity","1");
//				$(this).parent().css("background","none");
//			} else{
				for (var i = $(this).index(); i<$(".answer").length; i++) {
					if ($(".answer").eq(i).attr("class") === $(this).attr("class")) {
						$(this).css("opacity","1");
						$(".answer").eq(i).css("opacity","1");
						$(".answer").eq(i).parent().css("background","none");
					}
				}
//			}

		}
		else if($(this).css("opacity")==="1") {
//			if ($(this).attr("class").indexOf("_") === -1) {
//				$(this).css("opacity","0");
//				$(this).parent().css("background","url(img/fangda.svg) no-repeat right center");
//			} else{
				for (var i = $(this).index(); i<$(".answer").length; i++) {
					if ($(".answer").eq(i).attr("class") === $(this).attr("class")) {
						$(this).css("opacity","0");
						$(".answer").eq(i).css("opacity","0");
						$(".answer").eq(i).parent().css("background","url(img/fangda.svg) no-repeat right center");
					}
				}
//			}
		}

	})	
}
//whh 实时监听内容改变时，重新布局图片样式
var img_num,
    img_width,
    img_height,
    min_per;
function calculate(){
	for (var i=0; i<$(".note-editable").children().length; i++) {        		
		img_num = $(".note-editable").children().has("img").eq(i).children("span:has(img)").length;
	   $(".note-editable").children().has("img").eq(i).children("span:not(:has(img))").attr("class","");//所有的p下面的没有img的span标签去掉class
		switch (img_num){
			case 1:
			    $(".note-editable").children().has("img").eq(i).children("span:has(img)").attr("class","one");
			    for (var j=0; j<$(".note-editable").children().has("img").eq(i).children("span:has(img)").length; j++) {
			    	scale(340,180);
			    }
				break;
			case 2:
				if ($(".note-editable").children().has("img").eq(i-1).children("span:has(img)").length==3||$(".note-editable").children().has("img").eq(i-2).children("span:has(img)").length==3) {
					$(".note-editable").children().has("img").eq(i).children("span:has(img)").attr("class","three");
					for (var j=0; j<$(".note-editable").children().has("img").eq(i).children("span:has(img)").length; j++) {
    			    	scale(218,140);
    			    }
				} else{
					$(".note-editable").children().has("img").eq(i).children("span:has(img)").attr("class","two");
					for (var j=0; j<$(".note-editable").children().has("img").eq(i).children("span:has(img)").length; j++) {
    			    	scale(340,180);
    			    }
				}
				break;
			case 3:
			    $(".note-editable").children().has("img").eq(i).children("span:has(img)").attr("class","three");
			    for (var j=0; j<$(".note-editable").children().has("img").eq(i).children("span:has(img)").length; j++) {
			    	scale(218,140);
			    }
				break;
			case 4:
			    $(".note-editable").children().has("img").eq(i).children("span:has(img)").attr("class","two");
			    for (var j=0; j<$(".note-editable").children().has("img").eq(i).children("span:has(img)").length; j++) {
			    	scale(340,180);
			    }
				break;
			case 5:
			    $(".note-editable").children().has("img").eq(i).children("span:has(img)").attr("class","three");
			    for (var j=0; j<$(".note-editable").children().has("img").eq(i).children("span:has(img)").length; j++) {
			    	scale(218,140);
			    
			    }
				break;
			default:
				$(".note-editable").children().has("img").eq(i).children("span:has(img)").attr("class","three");
				for (var j=0; j<$(".note-editable").children().has("img").eq(i).children("span:has(img)").length; j++) {
			    	scale(218,140);

			    }
				break;
		}
		function scale(w,h){
			img_width=$(".note-editable ").children().has("img").eq(i).children("span:has(img)").eq(j).children().attr("own-width");
			img_height=$(".note-editable ").children().has("img").eq(i).children("span:has(img)").eq(j).children().attr("own-height");
			if (img_width>w || img_height>h) {
		    	min_per = Math.min(w/img_width,h/img_height);
		    	$(".note-editable").children().has("img").eq(i).children("span:has(img)").eq(j).children().
		    	css({"width":img_width*min_per/100+"rem","height":img_height*min_per/100+"rem"});
		    } else if (img_width<=w || img_height<=h) {
		    	$(".note-editable").children().has("img").eq(i).children("span:has(img)").eq(j).children().
		    	css({"width":img_width/100+"rem","height":img_height/100+"rem"});
		    }
		}
	
	}	
}
function parentVideoDialog(){
	window.parent.uploadRes(new Date().getTime(),'VIDEO','create');
}
function createVideo(src){
	  var _src = document.createAttribute('src');
	  _src.value=src;
	  var _controls = document.createAttribute('controls');
	  _controls.value = 'controls';
	  var _width = document.createAttribute('width');
	  _width.value="500";
	  var _height =document.createAttribute('height');
//			  _height.value="200";

//			  var cnode = document.createTextNode('<span>我是一个文字<span>')
	  var node = document.createElement('video');
	  node.setAttributeNode(_src);
	  node.setAttributeNode(_controls);
//			  node.setAttributeNode(_height);
	  node.setAttributeNode(_width);
	  // node.appendChild(cnode)
	  $('#summernote').summernote('insertNode',node)
}

