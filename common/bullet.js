var
	Box2D = require('./libs/box2dweb-2.1a3'),
	EventEmitter2 = require('./libs/eventemitter2').EventEmitter2,
	world = require('./box2dworld'),
	game = require('./game'),
	helpers = require('./helpers')
	;

var b2Vec2 = Box2D.Common.Math.b2Vec2;

var bullet = function(data) {
	var
		instance = new EventEmitter2(),
		width = 4,
		height = 4
		;
	var dx = data.target.x - data.from.x;
	var dy = data.target.y - data.from.y;

	var radians = Math.atan2(dy, dx);

	instance.userHash = data.userHash;
	instance.hash = data.hash;
	instance.vX = 20 * Math.cos(radians);
	instance.vY = 20 * Math.sin(radians);
	instance.x = data.from.x;
	instance.y = data.from.y;
	instance.width = width;
	instance.height = height;
	instance.type = 'bullet';
	console.log(instance.vX);
	console.log(instance.vY);

	instance.setBody = function(body) {
		this.body = body;
		this.body.SetBullet(true);
		var force = new b2Vec2(0, 0);
		force.x = this.vX;
		force.y = this.vY;

		// console.log(force);
		// var filter = this.body.GetFilterData();
		// filter.groupIndex = -1;
		// this.body.SetFilterData(filter);
		this.body.ApplyForce(force, this.body.GetWorldCenter());
	};

	instance.update = function() {

	};

	instance.customFixtureDef = function(body, fixture) {
		fixture.density = 4;
		fixture.restitution = 0.2;
		fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		fixture.shape.SetAsBox(helpers.meter(this.width)/2, helpers.meter(this.height)/2);

		bodyFixture = body.CreateFixture(fixture);

		var filter = bodyFixture.GetFilterData();
		filter.categoryBits = game.BULLET;
		filter.maskBits = game.BOUNDARY | game.PLAYER | game.BOULDER;
		bodyFixture.SetFilterData(filter);

		this.fixture = bodyFixture;

		return bodyFixture;
	};

	instance.getBody = function() {
		return this.body;
	};

	instance.toRawData = function() {
		return {
			hash: this.hash,
			type: this.type,
			x: helpers.pixel(this.body.GetWorldCenter().x),
			y: helpers.pixel(this.body.GetWorldCenter().y)
		};
	};
	instance.destroy = function() {
		instance.emit('destroy');
	};
	// console.log(instance);

	return instance;
};


require('./requireable')(module, 'bullet', bullet);

