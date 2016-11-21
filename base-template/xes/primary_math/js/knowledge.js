/**
 * 
 */
$(document).ready(function(){
	
	console.log( $(".knowledge_ul").width() ,$(".knowledge_ul").width()/conversionRatio );
	var ulWidthRem = $(".knowledge_ul").width()/conversionRatio;
	
	if(ulWidthRem<8.6){
		$(".scrollMenuBtn_left").hide();
		$(".scrollMenuBtn_right").hide();
	}
	/**
	 * 顶部菜单点击切换
	 */
	$(".knowledge_ul li").click(function(){
		myScroll();
		index = $(this).index();
		$(this).siblings().children("span"). removeClass("selected");
		$(this).children("span").addClass("selected");
		$(this).addClass("selected").siblings().removeClass("selected");
		
		//内容
		$(".content").children(".tabPage").hide().eq(index).show().css("display","block");
	});
	
	var widthRem = $(".knowledge_ul").width()/conversionRatio;
	$(window).resize(function(){
		widthRem = $(".knowledge_ul").width()/conversionRatio;
	});
	$(".scrollMenuBtn_left").mousedown(function(){ 
		$(this).addClass( "left_press" );
	});
	$(".scrollMenuBtn_left").mouseup(function(){ 
		$(this).removeClass( "left_press" );
	});
	$(".scrollMenuBtn_right").mousedown(function(){ 
		$(this).addClass( "right_press" );
	});
	$(".scrollMenuBtn_right").mouseup(function(){ 
		$(this).removeClass( "right_press" );
	});
	
	
	
	$(".scrollMenuBtn_left").click(function(){
		$(".scrollMenuBtn_right").removeClass("right_disabled");
		
		var leftPos = $(".knowledge_ul").position();
		var leftPosRem =  leftPos.left/conversionRatio + widthRem/3;
		
		if(leftPosRem>=0 || Math.abs(leftPosRem)<0.3  ) { 
			leftPosRem = 0; 
			$(this).addClass( "left_disabled" );
		}
		
		$(".knowledge_ul").animate({ left: leftPosRem + 'rem' });
	});
	
	
	$(".scrollMenuBtn_right").click(function(){
		$(".scrollMenuBtn_left").removeClass("left_disabled");
		
		var leftPos = $(".knowledge_ul").position();
		var leftPosRem =  leftPos.left/conversionRatio - widthRem/3 ;
		
		if( leftPosRem<=-6 ) { 
			leftPosRem = -6.5; 
			$(this).addClass( "right_disabled" );
		}
		
		$(".knowledge_ul").animate({ left: leftPosRem + 'rem' });
		
	});
	
	$(".demonImgBox").click(function(){

		$(this).parent().siblings("#popUp"+$(this).attr("name")).toggle();
        
	});
	
	$(".knowledge_popUp .close-btn").click(function() {
		console.log( 111 );
		//$(this).parent().parent().find("");
	});
	
	$(".knowledge_popUp_btn_box div").click(function() {
        $(this).parent().next().children().eq($(this).index()).show().siblings().hide();
        $(this).parent().siblings(".sanjiao").css("margin-left",0.75+$(this).index()*1.35 + "rem");
//      $(".sanjiao").css("margin-left",0.75+$(this).index()*1.35 + "rem");
    });
    
    
	
});

