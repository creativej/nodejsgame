var game = game || {};

(function(game, createjs) {
	'use strict';

	var acceleration = 3;

	function Bullet(point, targetX, targetY) {
		this.initialize(point, targetX, targetY);
	}

	Bullet.prototype = new createjs.Container();

	Bullet.prototype.parent_initialize = Bullet.prototype.initialize;

	Bullet.prototype.initialize = function(point, targetX, targetY) {
		var
			width = 4,
			height = 4,
			body = game.helpers.rect(width, height, 'rgba(255, 255, 255, 0.5)')
			;

		var dx = targetX - point.x;
		var dy = targetY - point.y;

		var radians = Math.atan2(dy, dx);

		this.parent_initialize();
		this.addChild(body);
		this.x = point.x;
		this.y = point.y;
		this.vX = 13 * Math.cos(radians);
		this.vY = 13 * Math.sin(radians);
		this.regX = width/2;
		this.regY = height/2;
		this.width = width;
		this.height = height;
		this.hitArea = body;
	};

	Bullet.prototype.tick = function() {
		this.x += this.vX;
		this.y += this.vY;

		this.vY += 0.08 * 4;
	};

	game.Bullet = Bullet;
})(game, createjs);
