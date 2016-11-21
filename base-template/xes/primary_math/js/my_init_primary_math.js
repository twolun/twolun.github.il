/**
 * 每个切片特有的js
 * 小学数学
 */

//通用文件
var cfiles = ['js/jquery.min.js',
             'css/preload.min.css', 
             'css/primary_math.css',  
             'js/preload.min.js',
             'js/primary_math.js'];
//私有文件             
var pfiles = [

           ];

var loader = new loader_common();
loader.addCommonFiles(cfiles);
loader.addPrivateFiles(pfiles);
loader.load();

