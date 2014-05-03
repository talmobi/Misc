
var canvas = document.createElement('canvas');

canvas.width = 300;
canvas.height = 300;

document.body.appendChild(canvas);

var img = new Image();
img.src = "aphextwin.jpg"

var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200,0,0)";  
ctx.fillRect(10, 10, 55, 50); 

img.onload = function() {
	ctx.drawImage(img, 0, 0);
}
//ctx.drawImage(100, 100, image);