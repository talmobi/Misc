
var canvas = document.createElement('canvas');

canvas.width = 300;
canvas.height = 300;
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.style.position = "absolute";

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

var Piece = function(i, j, sx, sy, sw, sh, x, y, w, h) {
	// sub region in source image
	this.sx = sx;
	this.sy = sy;
	this.sw = sw;
	this.sh = sh;

	// position and size on the canvas
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	// position in grid
	this.i = i;
	this.j = j;

	// original (correct) position
	this.oi = i;
	this.oj = j;

	this.draw = function(ctx) {
		ctx.drawImage(img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);
	}

	this.drawTo = function(ctx, x, y) {
		ctx.drawImage(img, this.sx, this.sy, this.sw, this.sh, x, y, this.w, this.h);
	}

	this.drawToPressed = function(ctx, x, y) {
		var a = 1.5;
		var ww = this.w / a;
		var hh = this.h / a;
		ctx.clearRect(x, y, this.w, this.h);
		ctx.drawImage(img, this.sx,
			this.sy, this.sw,
			this.sh, x + (this.w - ww) / 2, y + (this.h - hh) / 2,
			ww, hh);
	}
}

img.onload = function() {
	var sw = img.width / gridw;
	var sh = img.height / gridh;
	var dw = canvas.width / gridw;
	var dh = canvas.height / gridh;
	
	for (var i = 0; i < gridw; i++) {
		for (var j = 0; j < gridh; j++) {
			var sx = i * sw;
			var sy = j * sh;
			var dx = canvas.width / gridw * i;
			var dy = canvas.height / gridh * j
			var p = new Piece(i, j,
				sx, sy,
				sw, sh,
				dx, dy,
				dw - 1, dh - 1);
			grid[i][j] = p;
			p.draw(ctx);
		}
	}


	//grid[1][1].draw(ctx);
}

var selected = undefined;

canvas.addEventListener('mousedown', function(evt) {
	var x = evt.pageX;
	var y = evt.pageY;

	var dw = canvas.width / gridw;
	var dh = canvas.height / gridh;

	x = Math.floor(x / dw);
	y = Math.floor(y / dh);

	selected = grid[x][y];
	selected.drawToPressed(ctx, x * dw, y * dh);

	console.log("x: " + x + ", y: " + y);
});

canvas.addEventListener('mouseup', function(evt) {
	var x = evt.pageX;
	var y = evt.pageY;

	var dw = canvas.width / gridw;
	var dh = canvas.height / gridh;

	x = Math.floor(x / dw);
	y = Math.floor(y / dh);

	if (selected) {
		var to = grid[x][y];
		var from = selected;
		selected = undefined;

		// swap their positions
		to.i = from.i;
		to.j = from.j;
		grid[x][y] = from;
		grid[from.i][from.j] = to;
		from.i = x;
		from.j = y;

		// redraw the board
		var dw = canvas.width / gridw;
		var dh = canvas.height / gridh;
		for (var i = 0; i < gridw; i++) {
			for (var j = 0; j < gridh; j++) {
				grid[i][j].drawTo(ctx, i * dw, j * dh);
			}
		}
	}

	console.log("x: " + x + ", y: " + y);
});