(function() {
	'use strict';

	var
		helpers = require('./helpers'),
		game = require('./game'),
		Box2D = require('./libs/box2dweb-2.1a3')
		;

	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	module.exports = function(name, color) {

		var
			width = 20,
			height = 40,
			instance = {
				width: width,
				height: height,
				currentStates: [],
				remainJump: 0,
				regX: width/2,
				regY: height/2,
				vX: 2,
				vY: 2,
				canJump: true,
				bullets: [],
				type: 'player',
				blocked: false,
				snapToPixel: true,
				health: 100,
				body: {}
			}
			;

		instance.setHealth = function(value) {
			this.health = value;
		};

		instance.hit = function(object) {
			this.setHealth(Math.max(this.health - 10, 0));
		};

		instance.isGoingTo = function(name) {
			return this.currentStates.find(name);
		};

		instance.goingTo = function(name) {
			if (!this.currentStates.find(name)) {
				this.currentStates.push(name);
			}
		};

		instance.resetStates = function() {
			this.currentStates = [];
		};

		instance.jump = function(force) {
			if (this.remainJump > 0) {
				force.y -= 60;
				this.remainJump--;
			}

			if (this.landed) {
				this.remainJump = 5;
			}

			return force;
		};

		instance.update = function() {
			this.landed = (this._y === this.y);

			if (this.landed) {
				this.blocked = false;
			}

			this._y = this.y;
			this._x = this.x;

			var force = new b2Vec2(0, 0);
			var vel = this.body.GetLinearVelocity();

			if (instance.isGoingTo('move left')) {
				vel.x = -2;
			}

			if (instance.isGoingTo('move right')) {
				vel.x = 2;
			}

			if (instance.isGoingTo('stop moving')) {
				vel.x = 0;
			}

			if (instance.isGoingTo('jump')) {
				force = this.jump(force);
			}

			this.body.ApplyForce(
				force,
				this.body.GetWorldCenter()
			);

			this.body.SetLinearVelocity(vel);

			this.resetStates();
		};

		instance.getPixelPos = function() {
			return {
				x: helpers.pixel(this.body.GetWorldCenter().x),
				y: helpers.pixel(this.body.GetWorldCenter().y)
			};
		};

		instance.setBody = function(body) {
			this.body = body;
		};

		instance.getBody = function() { return this.body; };

		instance.globalRegPoint = function() {
			return this.localToGlobal(this.regX, this.regY);
		};

		instance.updateAim = function(x, y) {
			this.aimer.update(this.globalRegPoint(), x, y);
		};

		instance.setAimer = function(aimer) {
			this.aimer = aimer;
			this.addChild(this.aimer.getShape());
		};

		instance.applyFixture = function(fixture) {
			var filter = fixture.GetFilterData();
			filter.categoryBits = game.PLAYER;
			filter.maskBits = game.BOUNDARY;
			fixture.SetFilterData(filter);

			this.fixture = fixture;
		};

		instance.fire = function(targetX, targetY) {
			// var
			// 	point = this.globalRegPoint(),
			// 	self = this
			// 	;

			// var bullet = game.Bullet(point, targetX, targetY);
			// game.stage.addChild(bullet);

			// bullet.onDestroy = function() {
			// 	self.bullets.remove(this);
			// };
			// this.bullets.push(bullet);
		};

		instance.toRawData = function() {
			var pos = this.getPixelPos();

			return {
				x: pos.x,
				y: pos.y,
				width: width,
				height: height,
				color: color
			};
		};

		return instance;
	};
}());
