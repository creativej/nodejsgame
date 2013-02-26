
var
	helpers = require('./helpers'),
	game = require('./game'),
	Box2D = require('./libs/box2dweb-2.1a3'),
	EventEmitter2 = require('./libs/eventemitter2').EventEmitter2,
	helpers = require('./helpers'),
	meter = helpers.meter
	;

var b2Vec2 = Box2D.Common.Math.b2Vec2;
function character(hash, color) {
	var
		width = 20,
		height = 40,
		instance = new EventEmitter2()
		;

	instance.hash = hash;
	instance.width = width;
	instance.height = height;
	instance.currentStates = [];
	instance.remainJump = 0;
	instance.regX = width/2;
	instance.regY = height/2;
	instance.vX = 2;
	instance.vY = 2;
	instance.canJump = true;
	instance.bullets = [];
	instance.type = 'player';
	instance.blocked = false;
	instance.snapToPixel = true;
	instance.health = 100;
	instance.body = {};

	instance.setHealth = function(value) {
		this.health = value;
	};

	instance.hit = function(object) {
		this.setHealth(Math.max(this.health - 10, 0));

		this.emit('hit.player', this.health);
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
			force.y -= 100;
			this.remainJump--;
		}

		if (this.landed) {
			this.remainJump = 3;
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
			console.log('jump');
			force = this.jump(force);
		}

		this.body.ApplyForce(
			force,
			this.body.GetWorldCenter()
		);

		var pos = this.getPixelPos();

		this.x = Math.round(pos.x);
		this.y = pos.y;

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
		body.SetFixedRotation(true);

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

	instance.toRawData = function() {
		var pos = this.getPixelPos();

		return {
			hash: hash,
			x: pos.x,
			y: pos.y,
			width: width,
			height: height,
			color: color
		};
	};

	instance.customFixtureDef = function(body, fixture) {
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

		fixture.density = 4;
		fixture.restitution = 0;
		fixture.shape = new b2PolygonShape();
		fixture.shape.SetAsBox(meter(this.width)/2, meter(this.height)/2);

		bodyFixture = body.CreateFixture(fixture);

		var filter = bodyFixture.GetFilterData();
		filter.categoryBits = game.PLAYER;
		filter.maskBits = game.BOUNDARY | game.PLAYER | game.BOULDER;
		bodyFixture.SetFilterData(filter);

		//add foot sensor fixture
		var footSensor = new b2FixtureDef();
		footSensor.shape = new b2PolygonShape();
		footSensor.shape.SetAsOrientedBox(meter(7), meter(4), new b2Vec2(meter(width/4-5), meter(height/2)), 0);
		console.log(footSensor.shape);
		console.log(footSensor);
		footSensor.isSensor = true;
		footSensor.filter.categoryBits = game.FEET;
		footSensor.filter.maskBits = game.BOUNDARY | game.PLAYER | game.BOULDER;

		var footSensorFixture = body.CreateFixture(footSensor);
		footSensorFixture.SetUserData(this);

		this.fixture = bodyFixture;

		return fixture;
	};

	instance.getBody = function() {
		return this.body;
	};

	return instance;
}

require('./requireable')(module, 'character', character);
