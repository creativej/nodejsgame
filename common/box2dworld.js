	var
		Box2D = require('./libs/box2dweb-2.1a3'),
		EventEmitter2 = require('./libs/eventemitter2').EventEmitter2,
		helpers = require('./helpers'),
		map = require('./map')
		;

	var
		SCREEN_WIDTH = 800,
		SCREEN_HEIGHT = 600,
		b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
		meter = helpers.meter,
		pixel = helpers.pixel,
		interval,
		isDebug = false
		;

	// important box2d scale and speed vars
	var FPS = 24, TIMESTEP = 1/FPS;
	var debugContext;
	var lastTimestamp = Date.now();
	var fixedTimestepAccumulator = 0;
	var bodiesToRemove = [];
	var actors = [];
	// var objs = [];
	var destroyQueue = [];


	// box2d update function. delta time is used to avoid differences in simulation if frame rate drops
	var update = function(world) {
		var now = Date.now();
		var dt = now - lastTimestamp;
		fixedTimestepAccumulator += dt;
		lastTimestamp = now;

		// destroyQueue.each(function(body) {
		// 	world.DestroyBody(body);
		// });

		destroyQueue = [];

		while(fixedTimestepAccumulator >= FPS) {
			// update active actors
			actors.each(function(actor) {
				actor.update();
			});
			world.Step(TIMESTEP, 10, 10);

			fixedTimestepAccumulator -= FPS;
			world.ClearForces();

			if (isDebug) {
				world.m_debugDraw.m_sprite.graphics.clear();
	   			world.DrawDebugData();
			}
		}
	};

	var box2dworld = function(screenWidth, screenHeight) {
		// Box2d vars
		var
			instance = new EventEmitter2(),
			world = new b2World(new b2Vec2(0, 4), false)
			;

		map.create(world, screenWidth, screenHeight);

		instance.tick = function() {
			update(world);
		};

		instance.getMap = function() {
			return map;
		};

		instance.addContactListener = function(callbacks) {
			var listener = new Box2D.Dynamics.b2ContactListener;

			if (callbacks.BeginContact) {
				listener.BeginContact = function(contact) {
					callbacks.BeginContact(
						contact.GetFixtureA().GetBody().GetUserData(),
						contact.GetFixtureB().GetBody().GetUserData()
					);
				};
			}

			if (callbacks.EndContact) {
				listener.EndContact = function(contact) {
					callbacks.EndContact(
						contact.GetFixtureA().GetBody().GetUserData(),
						contact.GetFixtureB().GetBody().GetUserData()
					);
				};
			}

			if (callbacks.PostSolve) {
				listener.PostSolve = function(contact, impulse) {
					callbacks.EndContact(
						contact.GetFixtureA().GetBody().GetUserData(),
						contact.GetFixtureB().GetBody().GetUserData(),
						impulse.normalImpulses[0]
					);
				};
			}

			world.SetContactListener(listener);

			return this;
		};

		instance.addObject = function(actor) {
			var fixture = new b2FixtureDef();
			fixture.density = 4;
			fixture.restitution = 0;
			fixture.shape = new b2PolygonShape();
			fixture.shape.SetAsBox(meter(actor.width)/2, meter(actor.height)/2);

			var bodyDef = new b2BodyDef();
			bodyDef.type = b2Body.b2_dynamicBody;
			bodyDef.position.x = meter(actor.x);
			bodyDef.position.y = meter(actor.y);

			var obj = world.CreateBody(bodyDef);
			obj.SetFixedRotation(true);

			fixture = obj.CreateFixture(fixture);
			actor.applyFixture(fixture);

			actor.setBody(obj);

			obj.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
			actors.push(actor);
			// objs.push(obj);
			//
			//
		};

		instance.getActorsData = function() {
			return actors.map(function(actor) {
				return actor.toRawData();
			});
		};

		instance.setDebug = function(el) {
			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(el.getContext('2d'));
			debugDraw.SetDrawScale(30);
			debugDraw.SetFillAlpha(0.1);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);

			isDebug = true;
		};

		//Do one animation interation and start animating
		interval = setInterval(function () {
			update(world);

			instance.emit('tick');
		}, 1000/FPS);

		return instance;
	}(SCREEN_WIDTH, SCREEN_HEIGHT);

	require('./requireable')(module, 'world', box2dworld);
