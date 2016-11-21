
//处理视频
function privateVideoFun(){}
//检测本地是否有此视频文件,然后做出播放处理(播放百度or本地)  //这个方法暂时弃用（2016-8-31）
privateVideoFun.prototype.checkFile = function(item){
    var mediaId = item.attributes['mediaId'].nodeValue;
    var XMLHTTP;
    var filePath = 'video/'+mediaId+'.mp4'
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        XMLHTTP = new XMLHttpRequest();
    } else { // code for IE6, IE5
        XMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
        //XMLHTTP = new ActiveXObject("Msxml2.XMLHTTP.3.0");//如果是IE浏览器
    }
    XMLHTTP.open("HEAD",filePath,true);
    XMLHTTP.send(null);

    XMLHTTP.onreadystatechange=function(){
        if(XMLHTTP.readyState==4){
            if(XMLHTTP.status==200){
                 console.log("存在");//本地存在那么播放本地的
                //item.setAttribute("src","video/"+mediaId+".mp4");
            }else if(XMLHTTP.status=="404"){//video不在存(上百度云播放)
                 console.log("不存在")
                //item.setAttribute("src","http://ghecbzsm8v09hp5qsp9.exp.bcevod.com/"+mediaId+"/"+mediaId+".mp4");
            _privateVideoFun.createVodVideoNode(item);
            }
        }
    }
}
//创建百度云视频的播放参数
privateVideoFun.prototype.createVodObj=function(obj){
    var _file="http://ghecbzsm8v09hp5qsp9.exp.bcevod.com/";//固定的文件头  ff80808127d77caa0127d7e10f1c00c4       ff80808127d77caa0127d7e10f1c00c4
    var infor =  {
        stretching: "uniform",
        file: _file+obj.mediaId+"/"+obj.mediaId+".mp4",
        image:_file+obj.mediaId+"/"+obj.mediaId+".jpg",
        autostart: false,
        repeat: false,
        volume: 100,
        controls: true,
        ak: '714d097b64484693a7ec10ef42a921f7' // 公有云平台注册即可获得accessKey
    }
    obj.width>60?infor["width"]= obj.width:"";
    obj.height>60?infor["height"]= obj.height:"";
    var con = JSON.stringify(infor);
    var str = 'cyberplayer("'+obj.mediaId+'").setup('+con+')';
    return str;
}
//检测所有视频是否加入了百度云标签
privateVideoFun.prototype.changeVideo=function(){
    if(window.location.host==""){//本地环境运行 //window.location.href.substr(0,7).toLowerCase()=="http://"
        console.log('本地环境运行,无法检测本地视频是否存在！')
    }else{//网络环境
        var temp =  document.getElementsByTagName('video');
        var arr = [];
        for(var i=0;i<temp.length;i++) {
            var item = temp[i];
            if(item.hasAttribute("mediaId")){//是否上传视频到百度vod
               _privateVideoFun.checkFile(item);
                //_privateVideoFun.createVodVideoNode(item)
            }
        }
    }
}

privateVideoFun.prototype.createVodVideoNode=function(item){
    var mediaId = item.attributes['mediaId'].nodeValue
    var obj={mediaId:mediaId,width:item.width,height:item.height};
    var currId = mediaId+"_";
    item.outerHTML = '<span id="'+currId+'"> <div id="'+obj.mediaId+'"></div></span>';
    var addId = document.getElementById(currId);
    var scriptVodjs = document.createElement('script');
    var jsURL = 'http://resource.bcevod.com/player/cyberplayer.js';
    scriptVodjs.setAttribute("src",jsURL);
    addId.appendChild(scriptVodjs);
    var scriptVideo = document.createElement('script');
    scriptVideo.innerHTML = _privateVideoFun.createVodObj(obj);

    var iCount,total = 60;//3秒钟的时间来检测

    iCount = setInterval(function(){
        try{
            if(!total--){//超过规定次数就清理
                clearInterval(iCount);
                iCount = 0;
            }else{
                for(var i = 0;i<document.styleSheets.length;i++){
                    if(document.styleSheets[i].cssRules&&document.styleSheets[i].cssRules.length>0){
                        if(document.styleSheets[i].cssRules[0].selectorText==".jw-reset"){//百度vod样式标识
                            clearInterval(iCount);
                            iCount = 0;
                            addId.appendChild(scriptVideo)
                            break;
                        }
                    }
                }
            }
        }catch(e){
            clearInterval(iCount);
            iCount = 0;
            console.log("检测报错")
        }

    },50);
    setTimeout(function(){//如果没有检测到vod的样式标签，这里做最后的追加补充
        if(iCount!=0)
            addId.appendChild(scriptVideo);
    },3100);
}

//加入各种情况的video  source标签
privateVideoFun.prototype.addVideoSource=function(){
        var temp =  document.getElementsByTagName('video');
        var arr = [];
        for(var i=0;i<temp.length;i++) {
            var item = temp[i];
            if(item.hasAttribute("mediaId")){//是否上传视频到百度vod
                item.removeAttribute("src");
                 var _mediaId = item.attributes['mediaId'].nodeValue;
                var _html = '<source src="video/'+_mediaId+'.mp4">'+
                    '<source src="http://ghecbzsm8v09hp5qsp9.exp.bcevod.com/'+_mediaId+'/'+_mediaId+'.mp4">';
                item.innerHTML = _html;
                item.load();
            }
        }
}

var _privateVideoFun = new privateVideoFun();
//_privateVideoFun.changeVideo();//这里是百度的视频播放器 暂时不开放
_privateVideoFun.addVideoSource();
