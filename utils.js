/**
  * Utils
  */

var Vector2D = (function() {
  var self = this;

  self.add = function(v1, v2) {
    var x = v1.x + v2.x;
    var y = v1.y + v2.y;
    return {x: x, y: y};
  };

  self.subtract = function(v1, v2) {
    var x = v1.x - v2.x;
    var y = v1.y - v2.y;
    return {x: x, y: y};
  };

  self.length = function(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  };

  self.scale = function(v, scale) {
    return {x: v.x * scale, y: v.y * scale};
  };

  self.distance = function(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  self.dotProduct = function(v1, v2) {
    var dp = v1.x * v2.x + v1.y * v2.y;
    return dp;
  };

  self.normalize = function(v) {
    var leng = Math.sqrt(v.x * v.x + v.y * v.y)
    if (leng > 0) {
      return { x: v.x / leng, y: v.y / leng };
    } else {
      return { x: 0, y: 0 };
    }
  };

  return self;
})();

function friendlyInterval(func, sleep) {
  var intrvl = function() {
    setTimeout(intrvl, sleep);
    func.call();
  };

  setTimeout(intrvl, sleep);
};