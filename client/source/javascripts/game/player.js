(function($, app, game, createjs) {
	'use strict';

	function healthIndicator(x, y, width, height, color) {
		var
			container = new createjs.Container(),
			skin = game.helpers.rect(width, height, color),
			border = new createjs.Shape(
				new createjs.Graphics().beginStroke('rgba(255, 255, 255, 1)').rect(0, 0, width, height)
			)
			;

		container.x = x;
		container.y = y;
		skin.y = height;
		skin.regY = height;
		container.addChild(skin);
		container.addChild(border);
		container.set = function(value) {
			skin.scaleY = value;
		};

		return container;
	}

	function Player(options) {
		var
			container = new createjs.Container(),
			$container = $(container),
			width = options.width,
			height = options.height,
			color = options.color,
			skin = game.helpers.rect(width, height, color),
			hIndicator = healthIndicator(width + 5, 0, 4, 20, 'rgba(255, 255, 0, 1)'),
			health = 100
			;

		container.hash = options.hash;
		container.x = options.x;
		container.y = options.y;
		container.regX = width/2;
		container.regY = height/2;
		container.addChild(skin);
		container.addChild(hIndicator);
		container.bullets = [];
		container.snapToPixel = true;

		container.globalRegPoint = function() {
			return this.localToGlobal(this.regX, this.regY);
		};

		container.updateAim = function(x, y) {
			if (this.aimer) {
				this.aimer.update(this.globalRegPoint(), x, y);
			}
		};

		container.setAimer = function(aimer) {
			this.aimer = aimer;
			this.addChild(this.aimer.getShape());
		};

		container.die = function() {
			createjs.Tween.get(this).to({alpha:0}, 500, createjs.Ease.getPowIn(2.2)).call(function() {
				$container.trigger('died');
			});
		};

		container.on = function(name, callback) {
			$container.on(name, callback);
			return container;
		};

		container.onFire = function() {};

		container.fire = function(targetX, targetY) {
			var point = this.globalRegPoint();
			this.onFire({
				hash: 'bullet-' + app.helpers.guidGenerator(),
				target: {
					x: targetX,
					y: targetY
				},
				from: {
					x: point.x,
					y: point.y
				}
			});

			// $container.trigger('fire');
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

		return container;
	}

	// function Enemy(options) {
	// 	var character = Character(options);
	// 	character.isEnemy = true;

	// 	character.applyFixture = function(fixture) {
	// 		var filter = fixture.GetFilterData();
	// 		filter.categoryBits = game.ENEMY;
	// 		filter.maskBits = game.BOUNDARY | game.BULLET;
	// 		fixture.SetFilterData(filter);

	// 		this.fixture = fixture;
	// 	};

	// 	return character;
	// }

	// function Player(options) {
	// 	var character = Character(options);
	// 	character.applyFixture = function(fixture) {
	// 		var filter = fixture.GetFilterData();
	// 		filter.categoryBits = game.PLAYER;
	// 		filter.maskBits = game.BOUNDARY;
	// 		fixture.SetFilterData(filter);

	// 		this.fixture = fixture;
	// 	};

	// 	return character;
	// }

	game.Player = Player;
	// game.Enemy = Enemy;
})(jQuery, app, game, createjs);
