var game = game || {};

(function(window, $, game, createjs) {
	'use strict';

	game.runtime = {};

	game.init = function(canvas) {
		this.canvas = canvas;
		this.stage = new createjs.Stage(canvas);
		this.stage.snapPixelsEnabled = true;
		this.screenWidth = canvas.width;
		this.screenHeight = canvas.height;

		createjs.Ticker.useRAF = true;
		// Best Framerate targeted (60 FPS)
		createjs.Ticker.setFPS(30);

		//
	};

	game.tick = function() {
		// this.runtime.player.tick();
		// this.runtime.enemy.tick();
		// this.debug('player x: ' + this.runtime.player.x, true);
		// this.debug('player y: ' + this.runtime.player.y);
		// this.debug('mouse x: ' + this.stage.mouseX);
		// this.debug('mouse y: ' + this.stage.mouseY);
		// this.debug('enemy y: ' + this.runtime.enemy.y);

		// this.runtime.player.updateAim(this.stage.mouseX, this.stage.mouseY);

		// var point = this.runtime.player.globalLandingPoints();

		// var localPoint = this.runtime.map.globalToLocal(point.x, point.y);

		// if (this.helpers.hitTest(this.runtime.player, this.runtime.map)) {
		// 	this.debug('HIT!!');
		// }

		// update the stage:
		this.stage.update();
	};

	$(function() {
		var	$canvas = $("#canvas");
		$canvas.css('width', $canvas.prop('width'));
		$canvas.css('height', $canvas.prop('height'));
		game.init($canvas.get(0));

		// var map = new game.Map(game.maps[0]);
		// game.runtime.map = map;

		var player = new game.Player('player1', 'rgba(255,255,255,1)');
		player.x = 200;
		player.y = 100;
		player.vY = 2;
		console.log(player);
		// player.setAimer(new game.Aimer());

		game.runtime.player = player;

		// $('body').on('click', function() {
		// 	player.fire(game.stage.mouseX, game.stage.mouseY);
		// });

		// var enemy = new game.Enemy();

		// enemy.x = 400;
		// enemy.y = 0;
		// game.runtime.enemy = enemy;
		// game.stage.addChild(enemy);

		// game.stage.onMouseMove(function(e) {
		// 	console.log(e);
		// });

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

		var world = game.world(game.screenWidth, game.screenHeight);

		world.addObject(player);

		// game.stage.addChild(map);
		game.stage.addChild(player);

		createjs.Ticker.addListener(world);
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
})(window, jQuery, game, createjs);
