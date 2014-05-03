
var canvas = document.createElement('canvas');

canvas.width = 300;
canvas.height = 300;

document.body.appendChild(canvas);

var img = new Image();
img.src = "aphextwin.jpg"

var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200,0,0)";  
ctx.fillText("Loading", 25, 25);

/*
var c = createjs;
var stage = new c.Stage(canvas);
*/

var gridw = 3;
var gridh = 4; // 3 by 4 = 12 pieces

// 2d array
var grid = (function() {
	var arr = new Array(gridw);
	for (var i = 0; i < gridw; i++) {
		arr[i] = new Array(gridh);
	}
	return arr;
})();

var Piece = function(sx,sy,sw,sh,x,y,w,h) {
	this.sx = sx;
	this.sy = sy;
	this.sw = sw;
	this.sh = sh;

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.draw = function(ctx) {
		ctx.drawImage(img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);
	}
}

img.onload = function() {
	for (var i = 0; i < gridw; i++) {
		for (var j = 0; j < gridh; j++) {
			var w = img.width / gridw;
			var h = img.height / gridh;
			var x = i * w;
			var y = j * h;
			var dx = canvas.width / gridw * i;
			var dy = canvas.height / gridh * j
			var p = new Piece(x, y, x + w, y + h,
				dx, dy,
				dx + canvas.width / gridw, dy + canvas.height / gridh);
			grid[i][j] = p;
			p.draw(ctx);
		}
	}
}
