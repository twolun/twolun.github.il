var inited = [];
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
            $("#pdfToImgBox img").each(function(i) {
                  var img = $(this);
                $(img).css("zoom", 860/1600 * (clientWidth<=409.6?0.4:clientWidth/1024));
            })
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
        }
        $("#pdfToImgBox img").each(function(i){
            var img = $(this);
            $(img).css("zoom", 860/1600 *(clientWidth<=409.6?0.4:clientWidth/1024));
        });

    }
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, onResize, false);
    doc.addEventListener('DOMContentLoaded', onResize, false);
})(document, window);

// canvas动画
function initcanvas(dom_id,path,type,id,func){
    init(dom_id,path,type,id,func);
    var  canvas, stage, exportRoot;
    function init(dom_id,path,type,id,func) {
        canvas = document.getElementById(dom_id);
        window.onresize = function() {
            //canvas.style.position = "absolute";
            var rem =parseInt($(".pop-up").css("width")) ;
            var scale = Math.min(rem / canvas.width);
            canvas.style.width = canvas.width * scale + "px";
            canvas.style.height = canvas.height * scale + "px";
            // canvas.style.left = "0px";
            // canvas.style.top = "0px";
            // canvas.style.marginLeft = "-0.5rem";
        };
        if(inited[dom_id] ==true){
            window.onresize();
        }else {
            inited[dom_id] = true;
            images = images||{};
            ss = ss||{};
            var loader = new createjs.LoadQueue(false);
            loader.addEventListener("fileload", function(evt){
                handleFileLoad(evt)
            });
            loader.addEventListener("complete", function(evt){
                handleComplete(evt,id,func)
            });

            loader.setMaxConnections(100);
            loader.loadFile({src:path, type:type, id:id}, true);
            loader.loadManifest(lib.properties.manifest);
        }
        // console.log(inited);
    }

    function handleFileLoad(evt) {
        if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
    }

    function handleComplete(evt,id,func) {
        var queue = evt.target;
        ss[id] = queue.getResult(id);
        exportRoot = eval(func);
        stage = new createjs.Stage(canvas);
        stage.addChild(exportRoot);
        stage.update();
        createjs.Ticker.setFPS(lib.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);
    }
}

function canvasLoading(lib,canvasId){
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
            initcanvas(canvasId,'images/'+lib+'_atlas_.json','spritesheet',lib+'_atlas_','new lib.'+lib+'()');
        }
    }
}

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

$(document).ready(function(){

    // 设置tab选项卡所在容器的宽度
    var oLis = $('.tab-menu > li');
    var totalNum = $('.tab-menu > li').length;
    var aW = 0;
    $.each(oLis,function(i,item){
        aW += item.offsetWidth/(document.documentElement.clientWidth*100/1024);
    });
    $('.tab-menu ').css("width",aW+6*totalNum+"rem");

    // 给所有的选项卡注册单击事件
    oLis.on("click",function(){
        var i = $(this).index();
        $(this).addClass("current").siblings().removeClass("current");
        $(".tab-box").children().eq(i).show().siblings().hide();
    });

    //给向左向右按钮左侧单击事件
    var index = 0;
    var oLeft=0;
    $(".tab-container_1 .tab-switch>.rightBtn").on("click",function(){
        oLeft = 0;
        index += 1;
        console.log(index);
        for(var i = 0; i < index; i++){
            oLeft+= oLis[i].offsetWidth/(document.documentElement.clientWidth*100/1024)+0.6;
        }
        $('.tab-container_1 .tab-menu ').css("left",-oLeft + "rem");
        if (index >= totalNum-1) {
            index = 0;
            $('.tab-container_1 .tab-menu ').css("left",0+ "rem");
        }
    });

    $(".tab-container_1 .tab-switch>.leftBtn").on("click",function(){
        index -= 1;
        if(index == -1){
            index = 0;
        }
        console.log(index);
        oLeft -= oLis[index].offsetWidth/(document.documentElement.clientWidth*100/1024)+0.6;
        // console.log(oLis[index].offsetWidth);
        $('.tab-container_1 .tab-menu ').css("left",-oLeft + "rem");
        if (index <= 0) {
            index = 0;
            $('.tab-container_1 .tab-menu ').css("left",0 + "rem");
        }

    });

    // 内容显示隐藏
    $(".middle-show-btn").click(function () {
        if($(this).hasClass("btn-change")){
            $(this).removeClass("btn-change");
            $(this).parent().siblings(".canvas-box").css("opacity",0);
            $(this).next.css({
                "filter": "alpha(opacity=0)",
                "-moz-opacity": "0",
                "opacity":"0"
            })
        }else{
            $(this).addClass("btn-change");
            $(this).parent().siblings(".canvas-box").css("opacity",1);
            $(this).next.css({
                "filter": "alpha(opacity=1)",
                "-moz-opacity": "1",
                "opacity":"1"
            })
        }
    });


    //弹出框
    $(".middle-pop-up-btn").click(function(){
        $(this).siblings(".pop-up").show();
        console.log($(".middle-pop-up-btn"));
        myScroll();
    });
    $(".closeBtn").click(function () {
        $(this).parent().fadeOut();
    });

    //翻页
    $("#nextPageBtn").click(function(){
        $("#page1").fadeOut(300,function(){ $("#page2").fadeIn(300); });
        $(this).hide();
        $("#prevPageBtn").show();
    });
    $("#prevPageBtn").click(function(){
        $("#page2").fadeOut(300,function(){ $("#page1").fadeIn(300);});
        $(this).hide();
        $("#nextPageBtn").show();
    });

    // 开始挑战和返回按钮切页
    $("#startBtn").click(function(){
        $("#page1").fadeOut(300,function(){ $("#page2").fadeIn(300); });

        $(".header-text #title1").hide(300);
        $(".header-text #title2").show(300);
    });

    $("#backBtn").click(function(){
        $("#page2").fadeOut(300,function(){ $("#page1").fadeIn(300);});
        $(".header-text #title2").hide(300);
        $(".header-text #title1").show(300);
    });

    // 回到顶部按钮
    $(".top-btn").click(function(){
        myScroll();
    });
    $(window).scroll(function () {
        var scrollx = document.body.scrollTop || document.documentElement.scrollTop;
        if(scrollx==0&&$(".top-btn").css("display")!="none"){
            $(".top-btn").fadeOut()
        } else {
            $(".top-btn").fadeIn()
        }
    });
    // 给页面底部加上一层蒙板
    $('<div class="bottom-mask-wrapper"><div class="bottom-mask"></div></div>').insertBefore($('footer'));
});