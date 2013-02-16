var game = game || {};

(function(game, createjs) {
	'use strict';

	function tile(options) {
		var container = new createjs.Container();

		container.name = options.name || 'tile';
		container.type = 'tile';
		container.width = options.width;
		container.height = options.height;
		container.x = options.x;
		container.y = options.y;
		container.snapToPixel = true;

		container.addChild(
			new createjs.Shape(
				new createjs.Graphics()
				.beginFill('rgba(0, 0, 0, 1)')
				.rect(0, 0, options.width, options.height)
			)
		);

		return container;
	}

	game.tile = tile;
})(game, createjs);
