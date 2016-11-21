/**
 * Created by Administrator on 2016/11/2.
 */
$(function(){
    $.extend({
        controlVideo: function(containerClass,videoId) {
            var controls = (function(containerClass,videoId){
               function videoControls (containerClass,videoId) {
                   this.cantainerClass = containerClass;
                   this.videoId = videoId;
                   // 第一种视频样式控制器
                   this.videoControls1 =
                       '<div class="media-controls clearfix">'+
                       '<div class="switch fl"></div>'+
                       '<div class="progressBar fl">'+
                       '<div class="bufferBar">'+
                       '<div class="timeBar">'+
                       '<div class="circle"></div>'+
                       '</div>'+
                       '</div>' +
                       '</div>'+
                       '<div class="expand fr"></div>'+
                       '<div class="volume"><span class="volume-icon"></span>'+                          /* 王靖铭增加的部分 开始 */
                       '<div class="volume-panel">'+
                       '<div class="max-volume"><div class="current-volume"></div></div>'+
                       '</div>'+
                       '</div>'+                                                                         /* 王靖铭增加的部分 结束 */
                       '<div class="progressTime fr">'+
                       '<span class="current fl">00:00</span>'+
                       '<span class="splitters1 fl"></span>'+
                       '<span class="duration fl">00:00</span>'+
                       '</div>'+
                       '</div>';
                   // 第二种视频样式控制器
                   this.videoControls2 = '<div class="media-controls clearfix">'+
                       '<div class="switch fl"></div>'+
                       '<ul class="fr">'+
                       '<li class="prev fl"></li>'+
                       '<li class="next fl"></li>'+
                       '<li class="splitters2 fl"></li>'+
                       '<li class="expand fl"></li>'+
                       '</ul>'+
                       '</div>';
                   //this.videoContainer = $("."+containerClass);
                   this.videoContainer = $('#'+videoId).parent();
                   this.video = document.getElementById(videoId);
                   this.maxDuration = 0;
                   this.currentPos = 0;
                   this.m = 0;
                   this.s = 0;
//                 console.log(this.timeBar);
               }
                videoControls.prototype.controls = function(containerClass,videoId){
                    var thatVideoContainer = this.videoContainer;
                    //视频控制器通用控件事件
                    if(containerClass === "video-container1"){
                        this.videoContainer.append(this.videoControls1);
                    }else if(containerClass === "video-container2"){
                        this.videoContainer.append(this.videoControls2);
                    }

                    // 给创建的对象增加属性
                    this.timeBar = this.videoContainer.find('.timeBar');
                    this.duration = this.videoContainer.find('.duration');
                    this.current = this.videoContainer.find('.current');
                    this.bufferBar = this.videoContainer.find('.bufferBar');
                    this.timmer_Buffer = null;
                    this.progressBar = this.videoContainer.find('.progressBar');
                    this.switch = this.videoContainer.find('.switch');

                    this.volumeController = this.videoContainer.find('.volume');
                    this.volumePanel = this.videoContainer.find('.volume-panel');
                    this.maxVolumeEle = this.videoContainer.find('.max-volume');
                    this.currentVolumeEle = this.videoContainer.find('.current-volume');
                    this.mutedSwitch = this.videoContainer.find('volume-icon');
                    this.initVolume = 0.5;
                    this.currentVolume = 0.5;

                    var mediaControls = this.videoContainer.children(".media-controls");

                    // 视频控件过2s后隐藏，在PC端鼠标移入显示，鼠标移出后隐藏，
                    // 在移动设备上，点击视频容器区域，控制条切换显示隐藏状态
                    function browserRedirect() {
                        var sUserAgent = navigator.userAgent.toLowerCase();
                        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                        var bIsAndroid = sUserAgent.match(/android/i) == "android";
                        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
                        setTimeout(function() {
                            mediaControls.addClass("hide");
                        }, 2000);
                        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                            thatVideoContainer.on("click", function() {
                                mediaControls.toggleClass("hide");
                            });
                        } else {
                            thatVideoContainer.on("mouseenter", function() {

                                mediaControls.removeClass("hide");
//                              console.log('b');
                            });

                            thatVideoContainer.on("mouseleave", function() {
                                mediaControls.addClass("hide");
//                              console.log('aa');
                            });
                        }
                    }
                    browserRedirect();
                    /////////////////////////
                    // 王靖铭添加的部分 开始//

                    // 播放/暂停
                    var thatVideo = this.video;
                    this.videoContainer.find('.switch').on('click',function() {
                        if (thatVideo.paused) {
//                          console.log(thatVideo);
                            thatVideo.play();
                            //$(this).css("background-image", "url(img/pauseBtn.png)");
                            $(this).addClass('switch2');
                        } else {
                            thatVideo.pause();
                            //$(this).css("background-image", "url(img/playBtn.png)");
                            $(this).removeClass('switch2');
                        }
                    });

                    // 王靖铭添加的部分 结束 //
                    /////////////////////////

                    // 全屏播放
                    this.videoContainer.find('.expand').on('click', function(e) {
//                      console.log(e);
//                      console.log('clicked');
//                      console.log($(this));
                        if ($(this).hasClass('cancleScreen')) {
                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            } else if (document.mozExitFullScreen) {
                                document.mozExitFullScreen();
                            } else if (document.webkitExitFullscreen) {
                                document.webkitExitFullscreen();
                            }
                            $(this).removeClass('cancleScreen');
                            mediaControls.css({
                                'left': 0
                                //'bottom': 0    // 王靖铭注释掉
                            }).removeClass('fullControll');
//                          console.log('removed');

                        } else {
                            if (thatVideo.requestFullscreen) {
                                thatVideo.requestFullscreen();
                            } else if (thatVideo.mozRequestFullScreen) {
                                thatVideo.mozRequestFullScreen();
                            } else if (thatVideo.webkitRequestFullscreen) {
                                thatVideo.webkitRequestFullscreen();
                            } else if (thatVideo.msRequestFullscreen) {
                                thatVideo.msRequestFullscreen();
                            }
                            $(this).addClass('cancleScreen');

                            mediaControls.css({
                                'bottom': "-0.01rem"
                            });
                            mediaControls.addClass('fullControll');
                            //console.log($(this));
                            //console.log(mediaControls);
                            console.log(mediaControls.hasClass());
                        }
                        return false;
                    });
                     //按下ESC键时退出全屏
                    $(document).bind("keyup",function(e) {
                        if ($(".fullControll").length === 0) {
                            return false;
                        } else if (e.key === "Escape") {
                            thatVideoContainer.find('.expand').click();
                            console.log(thatVideoContainer.find('.expand'));
                            thatVideoContainer.mouseleave();
                        }
                        return false;
                    });

                    // 控制全屏下播放器控制台的显示与隐藏
                    $(document).bind("mousemove",function(e) {
                        if ($(".fullControll").length > 0) {
                            var screenHeight = window.screen.height;
                            var controllerHeight = mediaControls.height();
                            //console.log(screenHeight - e.pageY - 2 * controllerHeight);
                            //console.log(e.clientY);
                            //console.log(e.pageY);
                            if (screenHeight - e.clientY <= 2 * controllerHeight) {
                                mediaControls.removeClass("hide");
                                //console.log('<');

                            } else {
                                mediaControls.addClass("hide");
                                //console.log('>');

                            }
                        }
                        return false;
                    });

                    // 播放完毕时，切换播放按钮状态
                    //var thatSwitch = this.switch;
                    //this.video.onended = function() {
                    //    //thatVideoContainer.find('.switch').css("background-image", "url(img/playBtn.png)");
                    //    //thatVideoContainer.find('.switch').addClass('');
                    //    thatSwitch.removeClass('switch2');
                    //};
                };
                videoControls.prototype.setTime = function(){
                    var thatVideo = this.video;
                    var thatMaxDuration = this.maxDuration;
                    var thatCurrentPos = this.currentPos;
                    var thatM = this.m;
                    var thatS = this.s;
                    var thatTimeBar = this.timeBar;
                    var thatVideoContainer = this.videoContainer;
                    var thatDuration = this.duration;
                    var thatCurrent = this.current;
                    var thatBufferbar = this.bufferBar;
                    var thatTimmer_Buffer = this.timmer_Buffer;
                    var thatProgressBar = this.progressBar;
                    // 视频总时长，当前播放时间，播放进度
                    this.video.ontimeupdate = function() {
                        //视频总时长
                        thatMaxDuration = thatVideo.duration;
                        //Get currentTime
                        thatCurrentPos = thatVideo.currentTime;
                        //将视频总时长转换格式添加到页面
                        thatM = Math.floor(thatMaxDuration / 60);
                        thatS = Math.floor(thatMaxDuration % 60);
                        thatM = thatM < 10 ? '0' + thatM : thatM;
                        thatS = thatS < 10 ? '0' + thatS : thatS;
                        var total = thatM + ":" + thatS;
                        thatDuration.text(total);

                        // 加载当前播放时间
                        thatM = Math.floor(currentPos / 60);
                        thatS = Math.floor(currentPos % 60);
                        thatM = m < 10 ? '0' + thatM : thatM;
                        thatS = s < 10 ? '0' + thatS : thatS;
                        thatCurrent.text(thatM + ":" + thatS);
                        //播放进度条
                        var percentage = 100 * thatCurrentPos / thatMaxDuration; //in %
                        var totalWidth = thatProgressBar.offsetWidth;


                        // 王靖铭注释掉
                        // if (percentage * totalWidth / 100 <= 16) {
                        //     // document.querySelector('.timeBar').style.width = "0.16rem";
                        // } else {
                        //     document.querySelector('.timeBar').style.width = percentage + "%";
                        // }
                        if ($(".fullControll").length > 0) {
                            thatTimeBar[0].style.width = percentage * 0.063 + "rem";    // 王靖铭添加
                        } else {
                            thatTimeBar[0].style.width = percentage * 0.0285 + "rem";    // 王靖铭添加
                        }

                        //缓冲条
                        // var startBuffer = function() {
                        //     var maxduration = video.duration;
                        //     var currentBuffer = video.buffered.end(0);
                        //     var percentage = 100 * currentBuffer / maxduration;
                        //     $('.bufferBar').css('width', percentage+'%');

                        //     if(currentBuffer < maxduration) {
                        //         setTimeout(startBuffer, 100);
                        //     }
                        // };
                        // setTimeout(startBuffer, 100);
                    };

                    // 显示缓冲进度
                    var updateBufferView = function() {
                        var duration = thatVideo.duration,
                            currentBuffer = thatVideo.buffered.end(thatVideo.buffered.length - 1),
                            percentage = 100 * currentBuffer / duration;
                        if (percentage == 100) {
                            clearInterval(thatTimmer_Buffer);
                        }
                        thatBufferbar.css('width', percentage + '%');
                    };
                    this.video.addEventListener('canplay',function(){
                        console.log('canplay');
                        thatTimmer_Buffer = setInterval(updateBufferView,100);
                    });
                    // 前进/后退控制
                        // 获取节点
                        //var block = $(".circle")[0];
                        //var oW,oLeft;
                        //var progressBarW =$(".progressBar")[0].offsetWidth;
                        //// console.log(progressBarW);
                        //// 绑定touchstart事件
                        //block.addEventListener("touchstart", function(e) {
                        //    var touches = e.touches[0];
                        //    oW = touches.clientX - block.offsetLeft;
                        //    //阻止页面的滑动默认事件
                        //    document.addEventListener("touchmove",defaultEvent,false);
                        //},false);
                        //
                        //block.addEventListener("touchmove", function(e) {
                        //    var touches = e.touches[0];
                        //    oLeft = touches.clientX - oW;
                        //    if(oLeft < 0) {
                        //        oLeft = 0;
                        //    }else if(oLeft > progressBarW) {
                        //        oLeft = progressBarW;
                        //    }
                        //    block.style.left = oLeft/100 + "rem";
                        //    document.querySelector('.timeBar').style.width = oLeft/progressBarW*100 + "%";
                        //},false);
                        //block.addEventListener("touchend",function() {
                        //    currentPos = oLeft/progressBarW * maxDuration;
                        //    // console.log(currentPos);
                        //    video.currentTime = currentPos;
                        //    m = Math.floor(currentPos / 60);
                        //    s = Math.floor(currentPos % 60);
                        //    m = m < 10 ? '0' + m : m;
                        //    s = s < 10 ? '0' + s : s;
                        //    var currentTime = m + ":" + s;
                        //    video.currentTime = currentPos;
                        //    $('.current').html(currentTime);
                        //    document.querySelector('.timeBar').style.width = oLeft/progressBarW*100 + "%";
                        //    document.removeEventListener("touchmove",defaultEvent,false);
                        //},false);
                        // $(".circle").on("mousedown",function(e){
                        //     console.log(e.clientX);
                        //     $(".circle").on("mousemove",function(e){
                        //         console.log(e.clientX);
                        //     })
                        // });
                        // $(document).on("mouseup",function(){
                        //     $(".circle")[0].removeEventListener("mousedown",defaultEvent,false);
                        //     $(".circle")[0].removeEventListener("mousemove",defaultEvent,false);
                        // });
                        // function defaultEvent(e) {
                        //     e.preventDefault();
                        // }

                    /////////////////////////
                    // 王靖铭添加的部分 开始 //

                    // 判断是否在PC端
                    var isPC = false;
                    function browserRedirect() {
                        var sUserAgent = navigator.userAgent.toLowerCase(),
                            bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
                            bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
                            bIsMidp = sUserAgent.match(/midp/i) == "midp",
                            bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
                            bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
                            bIsAndroid = sUserAgent.match(/android/i) == "android",
                            bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
                            bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

                        if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
                            isPC = true;    // 判断为PC端
                        }
                    }
                    browserRedirect();

                    if (isPC) {

                        ////////////////////////////////////
                        // 实现鼠标对播放进度的控制 开始

                        var allowMousemove = false;                                 //设置当前进度是否跟随鼠标移动而改变

                        this.maxDuration = this.video.duration;                               //得到视频总长

                        // 鼠标在进度条上按下时跳转到鼠标指定位置
                        // 并且允许当前进度时间视图跟随鼠标移动而改变
                        // 并且解绑ontimeupdate事件
                        console.log(thatProgressBar);
                        console.log(this);
                        this.progressBar.mousedown(function(e){

                            allowMousemove = true;
                            // jumpToProgress(e);
                            // 解绑ontimeupdate事件
                            thatVideo.ontimeupdate = null;
                            // 得到鼠标位置占进度条的百分比
                            var positionInProgress = 0;
                            positionInProgress = (e.pageX - thatProgressBar.offset().left) / thatProgressBar.width();
                            if (positionInProgress < 0) {
                                positionInProgress = 0;
                            } else if (positionInProgress > 1) {
                                positionInProgress = 1;
                            }
                            // 播放进度点随鼠标变动
                            if ($(".fullControll").length > 0) {
                                thatTimeBar.css("width", positionInProgress * 6.3 + "rem");
                            } else {
                                thatTimeBar.css("width", positionInProgress * 2.85 + "rem");
                            }
                            // 改变当前播放进度视图
                            thatM = Math.floor(thatMaxDuration * positionInProgress / 60);
                            thatS = Math.floor(thatMaxDuration * positionInProgress % 60);
                            thatM = thatM < 10 ? '0' + thatM : thatM;
                            thatS = thatS < 10 ? '0' + thatS : thatS;
                            thatCurrent.text(thatM + ":" + thatS);
                            return false;
                        });

                        // 当前进度视图随鼠标的移动而改变
                        $(document).mousemove(function(e){
                                if (allowMousemove) {
                                    // 得到鼠标位置占进度条的百分比
                                    positionInProgress = (e.pageX - thatProgressBar.offset().left) / thatProgressBar.width();
                                    if (positionInProgress <= 0) {
                                        positionInProgress = 0;
                                    } else if (positionInProgress >= 1) {
                                        positionInProgress = 1;
                                    }
                                    // 播放进度点随鼠标变动
                                    if ($(".fullControll").length > 0) {
                                        thatTimeBar.css("width", positionInProgress * 6.3 + "rem");
                                    } else {
                                        thatTimeBar.css("width", positionInProgress * 2.85 + "rem");
                                    }
                                    // 改变当前播放进度视图
                                    thatM = Math.floor(thatMaxDuration * positionInProgress / 60);
                                    thatS = Math.floor(thatMaxDuration * positionInProgress % 60);
                                    thatM = thatM < 10 ? '0' + thatM : thatM;
                                    thatS = thatS < 10 ? '0' + thatS : thatS;
                                    thatCurrent.text(thatM + ":" + thatS);
                                }
                                return false;
                            })

                            // 当鼠标按键抬起时禁止当前播放进度视图跟随鼠标移动而改变
                            // 将播放进度跳转到鼠标抬起时处于的位置
                            // 重新绑定ontimeupdate事件
                            .mouseup(function(e){
// debugger;
                                if (allowMousemove) {
                                    // 播放进度跳转到鼠标抬起位置
                                    //jumpToProgress(e)
                                }

                                allowMousemove = false;

                                // 重新绑定ontimeupdate事件
                                thatVideo.ontimeupdate = function() {
                                    //视频总时长
                                    thatMaxDuration = thatVideo.duration;
                                    //Get currentTime
                                    thatCurrentPos = thatVideo.currentTime;
                                    //将视频总时长转换格式添加到页面
                                    thatM = Math.floor(thatMaxDuration / 60);
                                    thatS = Math.floor(thatMaxDuration % 60);
                                    thatM = thatM < 10 ? '0' + thatM : thatM;
                                    thatS = thatS < 10 ? '0' + thatS : thatS;
                                    var total = thatM + ":" + thatS;
                                    thatDuration.text(total);

                                    // 加载当前播放时间
                                    thatM = Math.floor(thatCurrentPos / 60);
                                    thatS = Math.floor(thatCurrentPos % 60);
                                    thatM = thatM < 10 ? '0' + thatM : thatM;
                                    thatS = thatS < 10 ? '0' + thatS : thatS;
                                    thatCurrent.text(thatM + ":" + thatS);
                                    //播放进度条
                                    var percentage = 100 * thatCurrentPos / thatMaxDuration;
                                    var totalWidth = document.querySelector(".progressBar").offsetWidth;
                                    if ($(".fullControll").length > 0) {
                                        thatTimeBar[0].style.width = percentage * 0.063 + "rem";
                                    } else {
                                        thatTimeBar[0].style.width = percentage * 0.0285 + "rem";
                                    }
                                };
                                return false;
                            });

                        // 定义一个使当前进度跳转到鼠标所指的位置的函数
                        function jumpToProgress(e) {
                            // 得到鼠标位置占进度条的百分比
                            var positionInProgress = (e.pageX - thatProgressBar.offset().left) / thatProgressBar.width();
                            var positionWillTo = 0;
                            // 得到鼠标位置对应的视频总长度上的位置
                            if (positionInProgress <= 0) {
                                positionWillTo = 0;
                            } else if (positionInProgress >= 1) {
                                positionWillTo = maxDuration;
                            } else {
                                positionWillTo = maxDuration * positionInProgress;
                            }
                            // 当前播放进度跳转到鼠标所在的位置
                            video.currentTime = positionWillTo;
                        }
                    }

                    // 实现鼠标对播放进度的控制 结束
                    ////////////////////////////////////
                    //return this;
                };

                videoControls.prototype.setVolume = function(){
                    var thatMaxVolumeEle = this.maxVolumeEle;
                    var thatVideo = this.video;
                    var thatVolumeController = this.volumeController;
                    var thatVolumePanel = this.volumePanel;
                    var thatCurrentVolumeEle = this.currentVolumeEle;
                    var thatMutedSwitch = this.mutedSwitch;
                    console.log(thatMutedSwitch);
                    var thatInitVolume = this.initVolume;
                    var thatCurrentVolume = this.currentVolume;
                    ////////////////////////////////////
                    // 实现鼠标对音量的控制 开始
                    var allowMousemoveVolume = false;

                    // 初始化音量
                    jumpToVolume(thatInitVolume);

                    if (!("ontouchstart" in window)) {
                        // 当鼠标按下时音量及视图跳转到指定位置
                        // 设置音量是否跟随鼠标的移动而改变
                        this.maxVolumeEle.mousedown(function(e){
                            // 允许音量跟随鼠标的移动而改变
                            allowMousemoveVolume = true;
                            thatVideo.muted = false;

                            // 得到鼠标位置占最大音量的百分比
                            thatCurrentVolume = 1 - ((e.pageY - thatMaxVolumeEle.offset().top) / thatMaxVolumeEle.height());
                            jumpToVolume(thatCurrentVolume);
                            return false;
                        });

                        // 令音量及其视图跟随鼠标的移动而改变
                        $(document).mousemove(function(e){
                                if (allowMousemoveVolume) {
                                    // 得到鼠标位置占最大音量的百分比
                                    thatCurrentVolume = 1 - ((e.pageY - thatMaxVolumeEle.offset().top) / thatMaxVolumeEle.height());

                                    jumpToVolume(thatCurrentVolume);
                                }
                                return false;
                            })
                            // 当鼠标抬起时禁止音量及其视图随鼠标移动而移动
                            .mouseup(function(){
                                // 禁止音量跟随鼠标的移动而改变
                                allowMousemoveVolume = false;
                                return false;
                            });
                        // 通过点击控制音量是否静音的转换
                        thatMutedSwitch.click(function(){
                            console.log($('.volume-panel:hidden'));
                            if ($(".volume-panel:hidden").length) {
                                thatVolumePanel.show();
                            } else if (thatVideo.muted) {
                                thatVideo.muted = false;
                                jumpToVolume(thatCurrentVolume);
                            } else {
                                thatVideo.muted = true;
                                jumpToVolume(0);
                            }
                            return false;
                        });
                        //点击除volume及volumePanel之外的任意地方就隐藏volumePanel
                        $(document).click(function(e){
                            if (e.target === $(".volume-panel")[0]) {
                                return false;
                            }
                            thatVolumePanel.hide();
                            return false;
                        });

                        // 当鼠标离开视频区域时隐藏volumePanel，且禁止音量随鼠标移动而变化
                        this.videoContainer.mouseleave(function(){
                            allowMousemoveVolume = false;
                            thatVolumePanel.hide();
                            return false;
                        });
                    } else {
                        thatMutedSwitch[0].addEventListener("touchstart",function(e){
                            console.log(e);
                        });
                        thatMutedSwitch[0].addEventListener("touchend",function(e){
                            thatVolumePanel.show();
                        });
                        thatMaxVolumeEle[0].addEventListener("touchstart",function(e){
                            // 得到鼠标位置占最大音量的百分比
                            // currentVolume = 1 - ((e.pageY - $maxVolumeEle.offset().top) / $maxVolumeEle.height());////////e.pageY换掉

                            // jumpToVolume(currentVolume);
                        });
                    }

                    // 定义一个音量及对应的视图跳转的函数
                    function jumpToVolume(currentVolume) {
                        // 防止音量取值范围溢出
                        if (thatCurrentVolume < 0) {
                            thatCurrentVolume = thatVideo.volume = 0;
                            thatCurrentVolumeEle.height(thatMaxVolumeEle.height() * currentVolume);
                        } else if (thatCurrentVolume > 1) {
                            thatCurrentVolume = thatVideo.volume = 1;
                            thatCurrentVolumeEle.height(thatMaxVolumeEle.height() * currentVolume);
                        } else {
                            // 设置当前音量对应的视图
                            thatCurrentVolumeEle.height(thatMaxVolumeEle.height() * currentVolume);
                            // 当前音量跳转到鼠标所在的位置
                            thatVideo.volume = currentVolume;
                        }
                    }
                    return this;
                    // 实现鼠标对音量的控制 结束
                    ///////////////////////////////////
                };
                return videoControls;
            })(containerClass,videoId);


            var videoWithControl = new controls(containerClass,videoId);
            videoWithControl.controls(containerClass,videoId);
            videoWithControl.setTime();
            videoWithControl.setVolume();


            console.log(videoWithControl);
        }
    });
});