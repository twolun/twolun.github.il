var inited = [];
var hadlib = false;
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        onResize = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth<=409.6){
                docEl.style.fontSize='40px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 1024) + 'px';
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
            docEl.style.fontSize = 100 * (clientWidth / 1024) + 'px';
            docEl.style.overflowX = 'hidden';
        }
    }
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, onResize, false);
    doc.addEventListener('DOMContentLoaded', onResize, false);
})(document, window);
//var canvas, stage, exportRoot;
//
//function init() {
//    canvas = document.getElementById("canvas");
//    exportRoot = new aa.aa();
//
//    stage = new createjs.Stage(canvas);
//    stage.addChild(exportRoot);
//    stage.update();
//
//    createjs.Ticker.setFPS(aa.properties.fps);
//    createjs.Ticker.addEventListener("tick", stage);
//}
function initcanvas(dom_id,path,type,id,func){
    if(path!="") {
        init(dom_id, path, type, id, func);
        var canvas, stage, exportRoot;

        function init(dom_id, path, type, id, func) {
            canvas = document.getElementById(dom_id);
            window.onresize = function () {
                //canvas.style.position = "absolute";
                var rem = parseInt($(".pop-up").css("width"));
                var scale = Math.min(rem / canvas.width);
                canvas.style.width = canvas.width * scale + "px";
                canvas.style.height = canvas.height * scale + "px";
                canvas.style.left = "0px";
                canvas.style.top = "0px";
                canvas.style.marginLeft = "-0.5rem";
            }
            if (inited[dom_id] == true) {
                window.onresize();
            } else {
                inited[dom_id] = true;
                images = images || {};
                ss = ss || {};
                var loader = new createjs.LoadQueue(false);
                loader.addEventListener("fileload", function (evt) {
                    handleFileLoad(evt)
                });
                loader.addEventListener("complete", function (evt) {
                    handleComplete(evt, id, func)
                });

                loader.setMaxConnections(100);
                loader.loadFile({src: path, type: type, id: id}, true);
                loader.loadManifest(lib.properties.manifest);
            }

        }


        function handleFileLoad(evt) {
            if (evt.item.type == "image") {
                images[evt.item.id] = evt.result;
            }
        }

        function handleComplete(evt, id, func) {
            var queue = evt.target;
            ss[id] = queue.getResult(id);
            exportRoot = eval(func);
            stage = new createjs.Stage(canvas);
            stage.addChild(exportRoot);
            stage.update();
            createjs.Ticker.setFPS(lib.properties.fps);
            createjs.Ticker.addEventListener("tick", stage);
        }
    }else {
        function init(dom_id,func) {
    canvas = document.getElementById(dom_id);
            exportRoot = eval(func);
    stage = new createjs.Stage(canvas);
    stage.addChild(exportRoot);
    stage.update();
    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener("tick", stage);
}
        init(dom_id,func);
    }
}
function jsloading(lib,canvasid){
    var head = document.getElementsByTagName('head');
    if(head&&head.length){
        head = head[0];
    }else{
        head = document.body;
    }
    var script = document.createElement('script');
    script.type = "text/javascript";
    head.appendChild( script);
    script.src = "js/"+ lib +".js";
    script.onload = script.onreadystatechange = function(){
        if ((!this.readyState) || this.readyState == "complete" || this.readyState == "loaded" ){
            $(".loading-img").css({
                "display":"none"
            });
            $(".loading-body").css({
                "animation-play-state":"paused",
                "-webkit-animation-play-state":"paused"
            });
            initcanvas('canvas','images/'+lib+'_atlas_.json','spritesheet',lib+'_atlas_','new lib.'+lib+'()');
        }
    }
}


//滚轮重置方法
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

$(document).ready(function(){
    if($("canvas").length>0){
        hadlib = true;
        //jsloading("JYFJS_mv","canvas");
    }
    $(".primary-pop-up-btn").click(function(){
        myScroll();
        var $parent = $(this).parent();
        
        $(this).parent().next(".pop-up").show();
        
        if(hadlib) {
            if ($(".loading-img").css("display") == "none") {
                //var lib = "JYFJS_mv"
                //initcanvas('canvas', 'images/' + lib + '_atlas_.json', 'spritesheet', lib + '_atlas_', 'new lib.' + lib + '()');
            }
        }
    })
    $(".close-btn").click(function () {
        $(this).parent().parent().fadeOut()
        var canvas = document.getElementById("canvas");
        //window.location.reload()
    })
    $(".top-btn").click(function() {
        myScroll();
    })
    $(".primary-show-btn").click(function () {
        if($(this).hasClass("btn-change")){
            $(this).removeClass("btn-change");
            $(this).parent().next().css({
                "filter": "alpha(opacity=0)",
                "-moz-opacity": "0",
                "opacity":"0"
            })
        }else{
            $(this).addClass("btn-change");
            $(this).parent().next().css({
                "filter": "alpha(opacity=1)",
                "-moz-opacity": "1",
                "opacity":"1"
            })

        }
    })
    $(".pop-up-title").click(function(){

    })
    $(window).scroll(function () {
        var scrollx = document.body.scrollTop || document.documentElement.scrollTop;
        if(scrollx==0&&$(".top-btn").css("display")!="none"){
            $(".top-btn").fadeOut()
        } else {
            $(".top-btn").fadeIn()
        }
    })
})