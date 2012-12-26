var game = game || {};

(function(game, createjs, Box2D) {
	'use strict';

	var meter = game.helpers.meter;
	var pixel = game.helpers.pixel;
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var acceleration = 3;

	function healthIndicator(x, y, width, height, color) {
		var
			container = new createjs.Container(),
			skin = game.helpers.rect(width, height, color),
			border = new createjs.Shape(
				new createjs.Graphics().beginStroke('rgba(255, 255, 255, 1)').rect(0, 0, width, height)
			)
			;

		container.x = x;
		container.y = y;
		skin.y = height;
		skin.regY = height;
		container.addChild(skin);
		container.addChild(border);
		container.set = function(value) {
			skin.scaleY = value;
		};

		return container;
	}

	function Character(name, color) {
		var
			container = new createjs.Container(),
			width = 20,
			height = 40,
			skin = game.helpers.rect(width, height, color),
			hIndicator = healthIndicator(width + 5, 0, 4, 20, 'rgba(255, 255, 0, 1)'),
			currentStates = [],
			health = 100
			;

		container.remainJump = 0;
		container.addChild(skin);
		container.addChild(hIndicator);
		container.regX = width/2;
		container.regY = height/2;
		container.vX = 2;
		container.vY = 2;
		container.width = width;
		container.height = height;
		container.canJump = true;
		container.bullets = [];
		container.type = 'character';
		container.blocked = false;
		container.snapToPixel = true;
		
		container.hit = function(object) {
			this.setHealth(Math.max(health - 10, 0));
		};

		container.setHealth = function(value) {
			health = value;
			hIndicator.set(health/100);
		};

		container.isGoingTo = function(name) {
			return currentStates.find(name);
		};

		container.goingTo = function(name) {
			if (!currentStates.find(name)) {
				currentStates.push(name);
			}
		};

		container.resetStates = function() {
			currentStates = [];
		};

		container.jump = function(force) {
			if (this.remainJump > 0) {
				force.y -= 60;
				this.remainJump--;
			}

			if (this.landed) {
				this.remainJump = 5;
			}

			return force;
		};

		container.update = function() {
			this.landed = (this._y === this.y);

			if (this.landed) {
				this.blocked = false;
			}

			this._y = this.y;
			this._x = this.x;

			var force = new b2Vec2(0, 0);
			var vel = this.body.GetLinearVelocity();

			if (container.isGoingTo('move left')) {
				vel.x = -2;
			}

			if (container.isGoingTo('move right')) {
				vel.x = 2;
			}

			if (container.isGoingTo('stop moving')) {
				vel.x = 0;
			}

			if (container.isGoingTo('jump')) {
				force = this.jump(force);
			}

			this.body.ApplyForce(
				force,
				this.body.GetWorldCenter()
			);

			this.body.SetLinearVelocity(vel);

			this.x = Math.round(pixel(this.body.GetWorldCenter().x));
			this.y = pixel(this.body.GetWorldCenter().y);

			this.resetStates();
		};

		container.setBody = function(body) {
			this.body = body;
		};

		container.getBody = function() { return this.body; };

		container.globalRegPoint = function() {
			return this.localToGlobal(this.regX, this.regY);
		};

		container.updateAim = function(x, y) {
			this.aimer.update(this.globalRegPoint(), x, y);
		};

		container.setAimer = function(aimer) {
			this.aimer = aimer;
			this.addChild(this.aimer.getShape());
		};

		container.applyFixture = function(fixture) {};

		container.fire = function(targetX, targetY) {
			var
				point = this.globalRegPoint(),
				self = this
				;

			var bullet = game.Bullet(point, targetX, targetY);
			game.stage.addChild(bullet);

			bullet.onDestroy = function() {
				self.bullets.remove(this);
			};
			this.bullets.push(bullet);
		};

		return container;
	}

	function Enemy(name, color) {
		var character = Character(name, color);
		character.isEnemy = true;

		character.applyFixture = function(fixture) {
			var filter = fixture.GetFilterData();
			filter.categoryBits = game.ENEMY;
			filter.maskBits = game.BOUNDARY | game.BULLET;
			fixture.SetFilterData(filter);

			this.fixture = fixture;
		};

		return character;
	}

	function Player(name, color) {
		var character = Character(name, color);
		character.applyFixture = function(fixture) {
			var filter = fixture.GetFilterData();
			filter.categoryBits = game.PLAYER;
			filter.maskBits = game.BOUNDARY;
			fixture.SetFilterData(filter);

			this.fixture = fixture;
		};

		return character;
	}

	game.Player = Player;
	game.Enemy = Enemy;
})(game, createjs, Box2D);
