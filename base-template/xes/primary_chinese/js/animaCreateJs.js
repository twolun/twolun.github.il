
/**
 * addAnimations()
 * @param {Array} canvasIds   [{ canvasId:idString , name:nameString ,lib:libQuote,autoPlay:Boolean },{ canvasId:idString , name:nameString ,lib:libQuote,autoPlay:Boolean }]
 * 
 * 
 * 
 * 
 */

var animaCreateJs = (function () {
	//私有 静态变量
	var exist;
	try {
		createjs
		exist = true;
	}
	catch(e){
		exist = false;
	}
	if( !exist ) {
		
	}
	else {
		var loader = new createjs.LoadQueue(false);
	}
	//私有静态方法
	//function aa(evt) {
		
	//}
	
	
	//构造函数
	return function ( canvasIds ) {
		//私有属性
		var canvas, stage,nameStr, someLib;
		var canvasAnimas = canvasIds || [];
		//私有属性
		var loadIndex = 0;
		var loadingBoo = false;	
		
		this.arrTest = [1 ,2 ,3];
		
//		var zoom = $("html").css("zoom");
		//$(".canvas_box").attr("style","zoom:"+1/$("html").css("zoom")+";transform: scale("+$("html").css("zoom")+","+$("html").css("zoom")+");transform-origin: 50% 0");
				 
    	/*$(".canvas_box")
        	.css({
            	'zoom': 1/zoom,
            	'transform': 'scale('+zoom+','+zoom+')',
            	'transform-origin' : '50% 0'
     	})*/
     	
		// 特权方法 , animaObj： { canvasId , name ,libParams }
		function check(animaObj){
			if(animaObj==null || animaObj==undefined) { throw new Error(" 你传入 animaCreateJs 方法的参数有问题  "); }
			else if(  typeof(animaObj["lib"])=="string" || animaObj["lib"]==undefined || animaObj["lib"]==null ) { throw new Error(" 你传入 animaCreateJs 的参数有问题  "); }
		}
		this.append = function( animaObj ){
			var str = animaObj["lib"];
			check(animaObj);
			canvasAnimas.push( animaObj );
			if(loadingBoo) {}
			else {
				loadingBoo = true;
				loadAnimation ( animaObj["canvasId"] , animaObj["name"] ,animaObj["lib"] );
			}
//			
		}
		//私有方法
		function loadAnimation ( canvasId , name ,libParams ,loadJson ) {
			createjs.MotionGuidePlugin.install();
			canvas = document.getElementById(canvasId);
			images = images||{};
			ss = ss||{};
			nameStr = name;
			someLib = libParams;
			var filespec = "images/"+ name +"_atlas_.json";
			//查验是否存在 *.json
			
            loader.loadFile({src:filespec , type:"spritesheet", id:name+"_atlas_" }, true);
			loader.loadManifest( libParams.properties.manifest);
	    }
		function handleFileLoad(evt) {
			console.log( "handleFileLoad" );
			if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
		}
	
		function handleCompleteLoop(evt) {
		
			var queue = evt.target;
			ss[ nameStr+"_atlas_"] = queue.getResult( nameStr +"_atlas_");
			var anima = new someLib[nameStr]();
			//animationArr[loadIndex] = anima;
			//animaCreateJs.animationArr[loadIndex] = anima; 
			
			stage = new createjs.Stage(canvas);
			animaCreateJs.prototype.animationArr[loadIndex] = { stage:stage,anima:anima};
			
			
			stage.addChild( anima );
			stage.update();
			stage.enableMouseOver();
			console.log( stage.canvas.id +"动画素材加载完毕");
			var obj = canvasAnimas[loadIndex];
			anima.autoplay = obj["autoPlay"];
			
			if( anima instanceof  createjs.MovieClip ) {
				if(obj["autoPlay"]==false) {
					anima.stop();
				}
			}
			
			$(document).trigger("loadComplete");
			createjs.Ticker.setFPS(someLib.properties.fps);
			createjs.Ticker.addEventListener("tick", stage);
			loadIndex++;
			if(loadIndex<canvasAnimas.length) {
				var obj = canvasAnimas[loadIndex];
				check(obj);
				loadAnimation ( obj["canvasId"] , obj["name"] ,obj["lib"] );
			}
			else { loadingBoo = false; }
		}
		function handleProgress(evt) {
			console.log( "Progress:",evt );
		}
		//特权方法	
		/*this.aa = function ( canvasId , name ,libParams) {
		};
			
		this.aa ( obj["canvasId"] , obj["name"] ,obj["lib"] );*/
		
		
		loader.addEventListener("fileload", handleFileLoad);
		loader.addEventListener("complete", handleCompleteLoop);
//		loader.addEventListener("progress", handleProgress);
		if( canvasAnimas.length!=0 )
		{
			var obj = canvasAnimas[loadIndex];
			check(obj);
			loadingBoo = true;
			loadAnimation ( obj["canvasId"] , obj["name"] ,obj["lib"] );
			
		}
		
	}
	
})();

//公有静态变量
//animaCreateJs.bb = [];


//公有实例方法 非特权方法

animaCreateJs.prototype = {
	/**
 	 *  动画装入其中 
 	 */
	animationArr:[],
	getIndexById: function ( canvasId ) { 
		var obj , idStr;
		var len = this.animationArr.length;
		for (var i = 0; i < len; i++) {
			obj = this.animationArr[i];
			idStr = obj["stage"].canvas.id ;
			if(idStr==canvasId){
				return i;
			}
		}
		return NaN;
	},
	getCanvasByAnima:function ( anima ) { 
		var obj , currentAnima;
		var len = this.animationArr.length;
		for (var i = 0; i < len; i++) {
			obj = this.animationArr[i];
			currentAnima = obj["anima"];
			if(currentAnima==anima){
				return this.animationArr[i]["stage"].canvas;
			}
		}
		return null;
	},
}




	