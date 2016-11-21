/**
 * Created by lmj on 2016/10/17.
 */

    //给向左向右按钮左侧单击事件
var oLis = $('.tab-menu > li');
var totalNum = $('.tab-menu > li').length;
var index = 0;
var oLeft=0.32;
$(".tab-container_2 .tab-switch>.rightBtn").on("click",function(){
    oLeft = 0.32;
    index += 1;
    console.log(index);
    var j = 4*index;
    for(var i = 0; i < j; i++){
        if(j> totalNum){
            j = totalNum;
        }
        oLeft+= oLis[i].offsetWidth/(document.documentElement.clientWidth*100/1024);
    }
    $('.tab-container_2 .tab-menu ').css("left",-oLeft + "rem");
    if (index >= Math.ceil(totalNum/4)) {
        index = 0;
        $('.tab-container_2 .tab-menu ').css("left",-0.32+ "rem");
        return false;
    }
});

$(".tab-container_2 .tab-switch>.leftBtn").on("click",function(){
    index -= 1;
    if(index == -1){
        index = 0;
    }
    console.log(index);
    oLeft -= oLis[index].offsetWidth/(document.documentElement.clientWidth*100/1024);
    // console.log(oLis[index].offsetWidth);
    $('.tab-container_2 .tab-menu ').css("left",-oLeft + "rem");
    if (index <= 0) {
        index = 0;
        $('.tab-container_2 .tab-menu ').css("left",-0.32 + "rem");
    }

});