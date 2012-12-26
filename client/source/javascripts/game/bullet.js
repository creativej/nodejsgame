var game = game || {};

(function(game, createjs) {
	'use strict';

	var acceleration = 3;
	var pixel = game.helpers.pixel;
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	function Bullet(point, targetX, targetY) {
		var
			container = new createjs.Container(),
			width = 4,
			height = 4,
			body = game.helpers.rect(width, height, 'rgba(255, 255, 255, 0.5)')
			;

		var dx = targetX - point.x;
		var dy = targetY - point.y;

		var radians = Math.atan2(dy, dx);
		container.type = 'bullet';
		container.addChild(body);
		container.x = point.x;
		container.y = point.y;
		container.vX = 20 * Math.cos(radians);
		container.vY = 20 * Math.sin(radians);
		container.regX = width/2;
		container.regY = height/2;
		container.width = width;
		container.height = height;
		container.hitArea = body;

		container.setBody = function(body) {
			this.body = body;
			this.body.SetBullet(true);
			var force = new b2Vec2(0, 0);
			force.x = this.vX;
			force.y = this.vY;
			// var filter = this.body.GetFilterData();
			// filter.groupIndex = -1;
			// this.body.SetFilterData(filter);
			this.body.ApplyForce(force, this.body.GetWorldCenter());
		};

		container.update = function() {
			// this.x += this.vX;
			// this.y += this.vY;

			// this.vY += 0.08 * 4;
			this.x = pixel(this.body.GetWorldCenter().x);
			this.y = pixel(this.body.GetWorldCenter().y);
		};

		container.applyFixture = function(fixture) {
			var filter = fixture.GetFilterData();
			filter.categoryBits = game.BULLET;
			filter.maskBits = game.BOUNDARY | game.ENEMY;
			fixture.SetFilterData(filter);
		};

		container.getBody = function() {
			return this.body;
		};
		container.destroy = function() {
			game.stage.removeChild(this);
			game.world.destroy(this);
		};

		game.world.addObject(container);

		return container;
	}

	game.Bullet = Bullet;
})(game, createjs);
