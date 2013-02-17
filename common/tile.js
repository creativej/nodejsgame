var
	Box2D = require('./libs/box2dweb-2.1a3'),
	EventEmitter2 = require('./libs/EventEmitter2').EventEmitter2,
	helpers = require('./helpers')
	;

var
	props = ['density', 'restitution'],
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	meter = helpers.meter,
	pixel = helpers.pixel
	;

function Tile(options) {
	var instance = new EventEmitter2();
	instance.name = options.name || 'tile';
	instance.type = 'tile';
	instance.width = options.width;
	instance.height = options.height;
	instance.snapToPixel = true;

	var
		fixture = new b2FixtureDef(),
		width = options.width / 2,
		height = options.height /2
		;

	props.each(function(key) {
		if (options[key] !== undefined) {
			fixture[key] = options[key];
		}
	});

	fixture.shape = new b2PolygonShape();
	fixture.shape.SetAsBox(meter(width), meter(height));

	var bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = meter(options.x + width);
	bodyDef.position.y = meter(options.y + height);

	instance.getBodyDef = function() {
		return bodyDef;
	};

	instance.addToWorld = function(world) {
		this.body = world.CreateBody(bodyDef);
		this.body.CreateFixture(fixture);
		this.body.SetUserData(this);

		this.emit('addedtoworld', instance.getPixelPos());

		return this;
	};

	instance.getPixelPos = function() {
		return {
			x: pixel(instance.body.GetWorldCenter().x) - width,
			y: pixel(instance.body.GetWorldCenter().y) - height
		};
	};

	instance.toJson = function() {
		var pos = this.getPixelPos();

		return {
			x: pos.x,
			y: pos.y,
			width: instance.width,
			height: instance.height
		};
	};

	return instance;
}

require('./requireable')(module, 'Tile', Tile);

