var game = game || {};

(function(game, Box2D) {
	var meter = game.helpers.meter;
	var pixel = game.helpers.pixel;

	// Box2d vars
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	// var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	// var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	// important box2d scale and speed vars
	var STEP = 20, TIMESTEP = 1/STEP;
	var debugContext;
	var world;
	var lastTimestamp = Date.now();
	var fixedTimestepAccumulator = 0;
	var bodiesToRemove = [];
	var actors = [];
	var objs = [];
	var destroyQueue = [];

	function createBoundaries(world, width, height) {
		var
			leftBoundary = game.Tile({
				x: -10,
				y: 0,
				width: 10,
				height: height
			}).createBody(world),
			rightBoundary = game.Tile({
				x: width,
				y: 0,
				width: 10,
				height: height
			}).createBody(world),
			bottomBoundary = game.Tile({
				x: 0,
				y: height - 10,
				width: width,
				height: 10
			}).createBody(world)
			;

		var container = new createjs.Container();
		container.addChild(leftBoundary);
		container.addChild(rightBoundary);
		container.addChild(bottomBoundary);

		return container;
	}

	// box2d update function. delta time is used to avoid differences in simulation if frame rate drops
	var update = function() {
		var now = Date.now();
		var dt = now - lastTimestamp;
		fixedTimestepAccumulator += dt;
		lastTimestamp = now;

		destroyQueue.each(function(body) {
			world.DestroyBody(body);
		});

		destroyQueue = [];

		while(fixedTimestepAccumulator >= STEP) {
			// update active actors
			actors.each(function(actor) {
				actor.update();
			});

			world.Step(TIMESTEP, 10, 10);

			fixedTimestepAccumulator -= STEP;
			world.ClearForces();
   			world.m_debugDraw.m_sprite.graphics.clear();
   			world.DrawDebugData();
		}
	};

	// box2d debugger
	var addDebug = function() {
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById('debug-canvas').getContext('2d'));
		debugDraw.SetDrawScale(30);
		debugDraw.SetFillAlpha(0.1);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
	};

	game.World = function(width, height) {
		world = new b2World(new b2Vec2(0, 4), false);
		var skin = createBoundaries(world, width, height);
		addDebug();

		return {
			skin: skin,
			world: world,
			addContactListener: function(callbacks) {
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
			},
			addObject: function(actor) {
				var fixture = new b2FixtureDef;
				fixture.density = 4;
				fixture.restitution = 0;
				fixture.shape = new b2PolygonShape;
				fixture.shape.SetAsBox(meter(actor.width)/2, meter(actor.height)/2);

				var bodyDef = new b2BodyDef;
				bodyDef.type = b2Body.b2_dynamicBody;
				bodyDef.position.x = meter(actor.x);
				bodyDef.position.y = meter(actor.y);

				obj = world.CreateBody(bodyDef);
				obj.SetFixedRotation(true);

				fixture = obj.CreateFixture(fixture);
				console.log(actor);
				actor.applyFixture(fixture);
				actor.setBody(obj);

				obj.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
				actors.push(actor);
				objs.push(obj);
			},
			destroy: function(actor) {
				actors.remove(actor);
				destroyQueue.push(actor.getBody());
			},
			tick: function() {
				update();
			}
		};
	};
})(game, Box2D);
