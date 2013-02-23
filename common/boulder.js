var
	EventEmitter2 = require('./libs/eventemitter2').EventEmitter2,
	Box2D = require('./libs/box2dweb-2.1a3'),
	helpers = require('./helpers'),
	meter = helpers.meter,
	game = require('./game')
	;

var boulder = function(options) {
	var instance = new EventEmitter2();
	console.log(options);
	instance.type = 'boulder';
	instance.hash = options.hash;
	instance.x = options.x;
	instance.y = options.y;
	instance.vX = 2;
	instance.vY = 2;
	instance.width = options.width;

	instance.customFixtureDef = function(body, fixture) {
		fixture.density = 4;
		fixture.restitution = 0;
		fixture.shape = new Box2D.Collision.Shapes.b2CircleShape(meter(options.width));

		bodyFixture = body.CreateFixture(fixture);

		var filter = bodyFixture.GetFilterData();
		filter.categoryBits = game.PLAYER;
		filter.maskBits = game.BOUNDARY | game.PLAYER | game.BOULDER | game.BULLET;
		console.log(filter);
		bodyFixture.SetFilterData(filter);
		this.fixture = bodyFixture;
		return fixture;
	};

	instance.setBody = function(body) {
		this.body = body;
	};

	instance.toRawData = function() {
		return {
			hash: this.hash,
			type: this.type,
			x: helpers.pixel(this.body.GetWorldCenter().x),
			y: helpers.pixel(this.body.GetWorldCenter().y),
			width: this.width
		};
	};

	instance.update = function() {};

	return instance;
};

require('./requireable')(module, 'boulder', boulder);
