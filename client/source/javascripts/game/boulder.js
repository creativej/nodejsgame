var game = game || {};

(function(game, createjs) {
	'use strict';

	function boulder(options) {
		var container = new createjs.Container();
		console.log(options);
		container.name = options.name || 'boulder';
		container.x = options.x;
		container.y = options.y;
		container.type = 'boulder';
		container.hash = options.hash;
		container.snapToPixel = true;
		container.width = options.width;
		container.height = options.width;
		container.addChild(
			new createjs.Shape(
				new createjs.Graphics()
				.beginFill('rgba(0, 0, 0, 1)')
				.drawCircle(0, 0, options.width)
			)
		);

		container.update = function(x, y) {
			this.x = x;
			this.y = y;
		};

		return container;
	}

	game.boulder = boulder;
})(game, createjs);
