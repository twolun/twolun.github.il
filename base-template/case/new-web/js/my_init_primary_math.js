/**
 * 每个切片特有的js
 */

//通用文件
var cfiles = [
	'css/preload.min.css',
	'css/primary_math.css',
	'js/jquery.min.js',
	'js/preload.min.js',
	'js/easeljs-0.8.1.min.js',
	'js/tweenjs-0.6.1.min.js',
	'js/movieclip-0.8.1.min.js',
	'js/preloadjs-0.6.1.min.js',

	'js/primary_math.js'

];
//私有文件             
var pfiles = [];
var loader = new loader_common();
loader.addCommonFiles(cfiles);
loader.addPrivateFiles(pfiles);
loader.load();