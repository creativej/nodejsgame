(function(game, createjs, Box2D) {
	var props = ['density', 'restitution'];
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var meter = game.helpers.meter;
	var pixel = game.helpers.pixel;

	function Tile(options) {
		var container = new createjs.Container();

		container.name = options.name || 'tile';
		container.type = 'tile';
		container.width = options.width;
		container.height = options.height;
		container.snapToPixel = true;

		container.addChild(
			new createjs.Shape(
				new createjs.Graphics()
				.beginFill('rgba(0, 0, 0, 1)')
				.rect(0, 0, options.width, options.height)
			)
		);

		container.createBody = function(world) {
			var
				fixture = new b2FixtureDef,
				width = options.width / 2,
				height = options.height /2
				;

			props.each(function(key) {
				if (options[key] != undefined ) {
					fixture[key] = options[key];
				}
			});

			fixture.shape = new b2PolygonShape;
			fixture.shape.SetAsBox(meter(width), meter(height));

			var bodyDef = new b2BodyDef;
			bodyDef.type = b2Body.b2_staticBody;
			bodyDef.position.x = meter(options.x + width);
			bodyDef.position.y = meter(options.y + height);
			this.body = world.CreateBody(bodyDef);
			this.body.CreateFixture(fixture);

			this.x = Math.round(pixel(this.body.GetWorldCenter().x) - width);
			this.y = Math.round(pixel(this.body.GetWorldCenter().y) - height);

			this.body.SetUserData(this);
			return this;
		}

		return container;
	}

	game.Tile = Tile;
})(game, createjs, Box2D);