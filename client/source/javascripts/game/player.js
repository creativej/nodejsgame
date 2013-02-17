(function(game, createjs) {
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
			width = options.width,
			height = options.height,
			color = options.color,
			skin = game.helpers.rect(width, height, color),
			hIndicator = healthIndicator(width + 5, 0, 4, 20, 'rgba(255, 255, 0, 1)'),
			health = 100
			;

		container.x = options.x;
		container.y = options.y;
		container.regX = width/2;
		container.regY = height/2;
		container.addChild(skin);
		container.addChild(hIndicator);
		container.bullets = [];
		container.snapToPixel = true;

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
})(game, createjs);
