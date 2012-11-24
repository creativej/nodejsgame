var game = game || {};

(function(game, Box2D) {
	function meter(pixels) {
		return pixels / 30;
	}

	function pixel(meters) {
		return meters * 30;
	}

	// Box2d vars
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	// var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	// var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	// important box2d scale and speed vars
	var STEP = 20, TIMESTEP = 1/STEP;

	var world;
	var lastTimestamp = Date.now();
	var fixedTimestepAccumulator = 0;
	var bodiesToRemove = [];
	var actors = [];
	var objs = [];

	function createBoundaries(world, width, height) {
		// boundaries - floor
		var floorFixture = new b2FixtureDef;
		floorFixture.density = 1;
		floorFixture.restitution = 0;
		floorFixture.shape = new b2PolygonShape;
		floorFixture.shape.SetAsBox(meter(width), meter(10));
		var floorBodyDef = new b2BodyDef;
		floorBodyDef.type = b2Body.b2_staticBody;
		floorBodyDef.position.x = meter(-25);
		floorBodyDef.position.y = meter(height);
		var floor = world.CreateBody(floorBodyDef);
		floor.CreateFixture(floorFixture);

		// boundaries - left
		var leftFixture = new b2FixtureDef;
		leftFixture.shape = new b2PolygonShape;
		leftFixture.shape.SetAsBox(meter(10), meter(height));
		var leftBodyDef = new b2BodyDef;
		leftBodyDef.type = b2Body.b2_staticBody;
		leftBodyDef.position.x = meter(-9);
		leftBodyDef.position.y = meter(-25);
		var left = world.CreateBody(leftBodyDef);
		left.CreateFixture(leftFixture);

		// boundaries - right
		var rightFixture = new b2FixtureDef;
		rightFixture.shape = new b2PolygonShape;
		rightFixture.shape.SetAsBox(meter(10), meter(height));
		var rightBodyDef = new b2BodyDef;
		rightBodyDef.type = b2Body.b2_staticBody;
		rightBodyDef.position.x = meter(width);
		rightBodyDef.position.y = meter(-25);
		var right = world.CreateBody(rightBodyDef);
		right.CreateFixture(rightFixture);
	}

	// actor object - this is responsible for taking the body's position and translating it to your easel display object
	var ActorObject = function(body, skin) {
		this.body = body;
		this.skin = skin;
		this.update = function() {  // translate box2d positions to pixels
			this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
			this.skin.x = pixel(this.body.GetWorldCenter().x);
			this.skin.y = pixel(this.body.GetWorldCenter().y);
		}
		actors.push(this);
	}

	// box2d update function. delta time is used to avoid differences in simulation if frame rate drops
	var update = function() {
		var now = Date.now();
		var dt = now - lastTimestamp;
		fixedTimestepAccumulator += dt;
		lastTimestamp = now;
		while(fixedTimestepAccumulator >= STEP) {
			// update active actors
			actors.each(function(actor) {
				actor.update();
			});

			world.Step(TIMESTEP, 10, 10);

			fixedTimestepAccumulator -= STEP;
			world.ClearForces();
   			// world.m_debugDraw.m_sprite.graphics.clear();
   			// world.DrawDebugData();
		}
	}

	game.world = function(width, height) {
		world = new b2World(new b2Vec2(0,10), true);

		createBoundaries(world, width, height);

		return {
			world: world,
			addObject: function(skin) {
				var fixture = new b2FixtureDef;
				fixture.density = 1;
				fixture.restitution = 0;
				fixture.shape = new b2PolygonShape;
				fixture.shape.SetAsBox(meter(skin.width), meter(skin.height));
				var bodyDef = new b2BodyDef;
				bodyDef.type = b2Body.b2_dynamicBody;
				bodyDef.position.x = meter(skin.x);
				bodyDef.position.y = meter(skin.y);

				var obj = world.CreateBody(bodyDef);
				obj.CreateFixture(fixture);

				// assign actor
				var actor = new ActorObject(obj, skin);
				obj.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()

				objs.push(obj);
			},
			tick: function() {
				update();
			}
		}
	}
})(game, Box2D);