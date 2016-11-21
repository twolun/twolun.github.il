var Rect = (function(){
	
	return function(x,y,w,h){
		this.left = x;
		this.right = x+w;
		this.top = y;
		this.bottom = y+h;
		this.pointCheck = function (pointTop,pointLeft) {
			var boo;
			//.log( pointTop>this.top , pointTop<this.bottom , pointLeft>this.left , pointLeft<this.right );
			if( pointTop>this.top && pointTop<this.bottom && pointLeft>this.left && pointLeft<this.right) {
				//.log( "矩形范围内" );
				boo = true;
			}
			else {
				//.log( "矩形范围外" );
				boo = false;
			}
			return boo;
		};
	}
	
})();
