var stage;
var fps = 30;

var size = 320;

var GLOBAL = {
	FPS: fps,
	gravity: 0.4,
	stageWidth: size,
	stageHeight: Math.floor(size * 9 / 16),
	mousePressed: false
}



var entities = [];
var buffer = [];

function init(id) {
	console.log("#" + id);

	var canvas = $("#" + id)[0];

	if (!canvas) {
		console.error("Provide the canvas element id to draw on.");
		return;
	}

	// set canvas size
	canvas.width = GLOBAL.stageWidth;
	canvas.height = GLOBAL.stageHeight;

	// grab the stage
	stage = new createjs.Stage(canvas);

	// set mouse listeners
	stage.addEventListener("stagemousedown" , function(evt) {
		GLOBAL.mousePressed = true;

		var p = spawnBox(GLOBAL.stageWidth / 2,GLOBAL.stageHeight - GLOBAL.stageHeight / 3,20,20);
		p.towards(evt.stageX, evt.stageY);
		addEntity(p);
	});

	stage.on('stagemouseup', function(){
		GLOBAL.mousePressed = false;
	});

	stage.on('stagemousemove', function(evt) {
		if (GLOBAL.mousePressed) {
			var p = spawnSingleParticle(evt.stageX, evt.stageY);
			addEntity(p);
		}
	});

	// canvas "around pixel" workaround for 1px thick solid lines.
	stage.regX = .5;
	stage.regY = .5;

	// visible border around the app area
	border = newSquare(1, 1, GLOBAL.stageWidth - 1, GLOBAL.stageHeight - 1);

	stage.addChild(border);

	// ticker
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(GLOBAL.FPS);

	// log some stats
	var logSpitter = function(func) {
		if (canvas && canvas) {
			console.log("entities: " + entities.length);
			console.log("FPS:" + createjs.Ticker.getMeasuredFPS());
			console.log("Time spent: " + createjs.Ticker.getMeasuredTickTime() );
		}
	}

	// better setInterval
	function friendlyInterval(func, sleep) {
		var f = function() {
			setTimeout(f, sleep);
			func.call();
		};

		setTimeout(f, sleep);
	};

	friendlyInterval(function() {
		logSpitter();

		var p = spawnBox(GLOBAL.stageWidth / 2,GLOBAL.stageHeight - GLOBAL.stageHeight / 3,20,20);
		p.towards(Math.random() * GLOBAL.stageWidth, 20);
		addEntity(p);
	}, 1000);
	
} // init

function spawnSingleParticle(x, y) {
	return spawnParticle(x, y, 2, 2);
}

function spawnBox(x, y, w, h) {
	var p = spawnParticle(x - w / 2, y - h / 2 , w, h);

	p.exploded = false;

	p.tick = function() {
		this.move();

		if (this.removed && !this.exploded) {
			exploded = true;


			if (this.w > 4 && this.h > 4) {
				for (var i = 0; i < 3; i++) {
					var pp = spawnBox(this.x + i / 2, this.y, this.w / 2, this.h / 2);
					pp.yspeed = (-2) - (Math.random() * 4);
					pp.xspeed = 2 - Math.random() * 5;
					addEntity(pp);
				}
			}
		}
	}

	return p;
}

function spawnParticle(x, y, w, h) {
	var p = newSquare(x,y,w,h);

	p.jumps = 8;
	p.removed = false;
	p.xspeed =  .5 - Math.random();
	p.yspeed = .5 - Math.random();
	p.weight = .8 + Math.random() * 4;

	p.towards = function(x, y) {
		this.xspeed = (x + Math.random() * 10 - this.x - 5) / 10;
		this.yspeed = (y + Math.random() * 20 - this.y - 10) / 10;
	}

	p.tick = function() {
		this.move();
	}

	p.move = function() {
		var hh = this.h / 2;

		this.yspeed += GLOBAL.gravity;
		this.x += this.xspeed;
		this.y += this.yspeed;

		if (this.y + this.h > GLOBAL.stageHeight) {
			if (--this.jumps < 0 || this.yspeed < 1)
				this.removed = true;
			else {
				this.yspeed = -this.yspeed / (2 * this.weight);
				this.y = GLOBAL.stageHeight - this.h;
			}
		}

		var hw = this.w / 2;

		if (this.x + this.w > GLOBAL.stageWidth) {
			this.xspeed = -this.xspeed / 3;
			this.x = GLOBAL.stageWidth - this.w;
		} else if (this.x < 1) {
			this.xspeed = -this.xspeed / 3;
			this.x = 1;
		}
	};
	return p;
}

function newSquare(x, y, w, h) {
	var s = new createjs.Shape();
	s.snapToPixel = true;
	s.graphics.setStrokeStyle(1).beginStroke("white").rect(0,0,w,h);
	s.w = w;
	s.h = h;
	s.x = x;
	s.y = y;
	return s;
}

var pressed = true;

function tick() {
	stage.update();

	/* if (pressed) {
		stage.addChild( spawnSingleParticle() );
	} */

	for (var i = 0; i < entities.length; i++) {
		var e = entities[i];
		if (!e.removed) {
			e.tick();
			addEntity(e);
		} else {
			stage.removeChild(e);
		}
	}

	if (buffer.length > 0) {
		entities = buffer;
		buffer = [];
	}
}

function addEntity(e) {
	if (entities.length < 1000) {
		buffer.push(e);
		stage.addChild(e);
	}
}