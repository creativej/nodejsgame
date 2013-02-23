(function(game, createjs) {
	'use strict';

	function Bullet(options) {
		var
			container = new createjs.Container(),
			width = options.width || 4,
			height = options.height || 4,
			color = options.color || 'rgba(255, 255, 255, 0.5)',
			body = game.helpers.rect(width, height, color)
			;

		container.hash = options.hash;
		container.addChild(body);
		container.x = options.x;
		container.y = options.y;
		container.regX = width/2;
		container.regY = height/2;
		container.width = width;
		container.height = height;

		container.update = function(x, y) {
			this.x = x;
			this.y = y;
		};

		return container;
	}

	game.Bullet = Bullet;
})(game, createjs);
