var game = game || {};

(function(window, $, game, createjs) {
	'use strict';

	var player;

	game.init = function(canvas) {
		this.canvas = canvas;
		this.stage = new createjs.Stage(canvas);
		this.screenWidth = canvas.width;
		this.screenHeight = canvas.height;

		createjs.Ticker.useRAF = true;
		// Best Framerate targeted (60 FPS)
		createjs.Ticker.setFPS(30);

		//
	};

	game.tick = function() {
		player.tick();

		// update the stage:
		this.stage.update();
	};

	$(function() {
		var	$canvas = $("#canvas");
		$canvas.css('width', $canvas.prop('width'));
		$canvas.css('height', $canvas.prop('height'));
		game.init($canvas.get(0));

		var map = game.helpers.generateMap(game.maps[0]);

		player = new game.Player('player1', 'rgba(255,255,255,1)');

		player.x = 200;
		player.y = 100;
		// var container = new createjs.Container();
		// var rect = game.helpers.rect(50, 50, "rgba(255,255,255,1)");
		// rect.x = 50;
		// rect.y = 10;

		// container.addChild(rect);

		// var rect = game.helpers.rect(50, 50, "rgba(255,255,255,1)");
		// rect.x = 130;
		// rect.y = 10;

		// container.addChild(rect);

		// container.y = 50;

		game.stage.addChild(map);
		game.stage.addChild(player);

		createjs.Ticker.addListener(game);

		// game.images = {};
		// game.images.star = image('/images/stars.png');
		// game.sprites = {};
		// game.sprites.star = new createjs.SpriteSheet({
		// 	images: [game.images.star],
		// 	frames: { width: 31, height: 52, regX: 0, regY: 0},
		// 	animations: {
		// 		fall: [0, 6, 'fall']
		// 	}
		// });

		// var starAnimation = new createjs.BitmapAnimation(game.sprites.star);
		// starAnimation.gotoAndPlay('fall');
		// starAnimation.name = 'star1';
		// starAnimation.direction = 90;
		// starAnimation.vY = 4;
		// starAnimation.x = Math.random()*400;
		// starAnimation.y = 0;
		// starAnimation.currentFrame = 0;
		// game.stage.addChild(starAnimation);
		// game.stage.update();
	});
})(window, $, game, createjs);
