/**
 * 每个切片特有的js
 * 初中数学
 */

//通用文件
var cfiles = ['js/jquery.min.js',
             'css/preload.min.css', 
             'css/high_math.css',  
             'js/preload.min.js',
             'js/high_math.js'];
//私有文件             
var pfiles = [

           ];

var loader = new loader_common();
loader.addCommonFiles(cfiles);
loader.addPrivateFiles(pfiles);
loader.load();

