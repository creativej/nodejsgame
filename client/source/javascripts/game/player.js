var game = game || {};

(function(game, createjs) {
	'use strict';

	var acceleration = 3;

	function Player(name, color) {
		this.initialize(name, color);
	}

	Player.prototype = new createjs.Container();

	Player.prototype.parent_initialize = Player.prototype.initialize;

	Player.prototype.jump = function() {
		var maxHeight = this.height * 3;

		if (this.canJump) {
			this.vY = -5;
			this.isJumping = true;
			this.canJump = false;
		}

		if (this.isJumping) {
			this.vY -= 0.1;
		}

		if (this._y + maxHeight <= this.y) {
			this.isJumping = false;
			this.canJump = false;
		}
	};

	Player.prototype.tick = function() {
		this._x = this.x;
		this._y = this.y;

		// Gravity
		this.vY += acceleration * 0.1;

		// if (game.KeyState.isDown('s')) {
		// 	this.y += this.vY;
		// }

		if (game.KeyState.isDown('a')) {
			this.x -= this.vX;
		}

		if (game.KeyState.isDown('d')) {
			this.x += this.vX;
		}

		if (game.KeyState.isDown('w')) {
			this.jump();
		} else {
			this.isJumping = false;
		}

		this.y += Math.floor( Math.min(this.vY, 10) );

		if ( this.isLanded(game.runtime.map) ) {
			this.vY = 0;
			this.canJump = true;

			while (this.isLanded(game.runtime.map)) {
				this.y--;
			}

			this.y++;
		}

		this.x = Math.max(0 + this.width/2, this.x);
		this.x = Math.min(game.screenWidth - this.width/2, this.x);

		this.bullets.each(function(bullet) {
			bullet.tick();

			if (this.regX <= 0 || this.regX >= game.screenWidth || this.regY <= 0 || this.regY > game.screenHeight) {
				game.stage.removeChild(bullet);
				this.bullets.remove(bullet);
			}
		});
	};

	Player.prototype.initialize = function(name, color) {
		var
			width = 20,
			height = 40,
			body = game.helpers.rect(width, height, color)
			;

		this.parent_initialize();
		this.addChild(body);
		this.name = name;
		this.regX = width/2;
		this.regY = height/2;
		this.vX = 2;
		this.vY = 2;
		this.width = width;
		this.height = height;
		this.hitArea = body;
		this.canJump = true;
		this.bullets = [];
	};

	Player.prototype.landingPoints = function() {
		return [
			new createjs.Point(0, this.height),
			new createjs.Point(this.width, this.height)
		];
	};

	Player.prototype.globalRegPoint = function() {
		return this.localToGlobal(this.regX, this.regY);
	};

	Player.prototype.isLanded = function(target) {
		var
			player = this,
			landed = false,
			targetLocal
			;

		this.landingPoints().each(function(point) {
			targetLocal = player.localToLocal(point.x, point.y, target);

			if (target.hitTest(targetLocal.x, targetLocal.y)) {
				landed = true;
				return false;
			}
		});

		return landed;
	};

	Player.prototype.updateAim = function(x, y) {
		this.aimer.update(this.globalRegPoint(), x, y);
	};

	Player.prototype.setAimer = function(aimer) {
		this.aimer = aimer;
		this.addChild(this.aimer.getShape());
	};

	Player.prototype.fire = function(targetX, targetY) {
		var
			point = this.globalRegPoint()
			;

		var bullet = new game.Bullet(point, targetX, targetY);
		game.stage.addChild(bullet);
		this.bullets.push(bullet);
	};

	game.Player = Player;
})(game, createjs);
