var game = game || {};

(function(game, createjs) {
	'use strict';

	function Aimer() {
		var graphics = new createjs.Graphics();
		var shape = new createjs.Shape(graphics);

		this.getShape = function() {
			return shape;
		};

		this.update = function(start, x, y) {
			var localStart = shape.globalToLocal(start.x, start.y);
			var localEnd = shape.globalToLocal(x, y);

			// var dx = x - start.x;
			// var dy = y - start.y;

			// var radians = Math.atan2(dy, dx);
			// var angle = radians * 180 / Math.PI;
			// game.debug('angle: ' + angle);

			graphics.clear();
			graphics
				.beginStroke("rgba(255,255,255, 0.2)")
				.moveTo(localStart.x, localStart.y)
				.lineTo(localEnd.x, localEnd.y)
				.endStroke();
		};
	}

	game.Aimer = Aimer;
})(game, createjs);
