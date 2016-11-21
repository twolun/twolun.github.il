/**
 * 每个切片特有的js
 */

//通用文件
var cfiles = ['js/jquery.min.js',
             'css/preload.min.css', 
             'css/middle_chemistry.css',  
             'js/preload.min.js',
             'js/middle_chemistry.js'];
//私有文件             
var pfiles = [
		
           ];

var loader = new loader_common();
loader.addCommonFiles(cfiles);
loader.addPrivateFiles(pfiles);
loader.load();

