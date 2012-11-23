var game = game || {};

(function(game, createjs) {
	'use strict';

	function Player(name, color) {
		this.initialize(name, color);
	}

	Player.prototype = new createjs.Container();

	Player.prototype.parent_initialize = Player.prototype.initialize;

	Player.prototype.tick = function() {
		if (game.KeyState.isDown('w')) {
			this.y -= this.vY;
		}

		if (game.KeyState.isDown('s')) {
			this.y += this.vY;
		}

		if (game.KeyState.isDown('a')) {
			this.x -= this.vX;
		}

		if (game.KeyState.isDown('d')) {
			this.x += this.vX;
		}
	};

	Player.prototype.initialize = function(name, color) {
		this.parent_initialize();
		this.addChild(game.helpers.rect(20, 40, color));
		this.name = name;
		this.vX = 2;
		this.vY = 2;
	};

	game.Player = Player;
})(game, createjs);
