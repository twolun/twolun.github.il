$(document).ready(function(){
	var clientW = document.documentElement.clientWidth;
	conversionRatio = clientW / 1024 * 100;
	
	$(window).resize(function() {
		clientW = document.documentElement.clientWidth;
		if(clientW<=409.6){ conversionRatio = 40; }
		else { conversionRatio = clientW / 1024 *100; }
		
		//.log( "resize," ,"conversionRatio:",conversionRatio ,",clientW", clientW );
	});
});
 var conversionRatio;
	
