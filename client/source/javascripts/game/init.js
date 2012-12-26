var game = game || {};

(function(window, $, game, createjs) {
	'use strict';

	game.runtime = {};

	game.init = function(canvas) {
		this.canvas = canvas;
		this.stage = new createjs.Stage(canvas);
		this.stage.snapPixelsEnabled = true;
		this.screenWidth = parseInt(canvas.width, 10);
		this.screenHeight = parseInt(canvas.height, 10);

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
		var player = this.runtime.player;

		if (game.KeyState.isDown('a')) {
			player.goingTo('move left');
		}

		if (game.KeyState.isDown('d')) {
			player.goingTo('move right');
		}

		if (game.KeyState.isDown('w')) {
			player.goingTo('jump');
		}

		if (
			(!game.KeyState.isDown('a') && !game.KeyState.isDown('d')) ||
			(!player.landed && player.blocked)
		) {
			player.goingTo('stop moving');
		}

		player.updateAim(this.stage.mouseX, this.stage.mouseY);

		// var point = this.runtime.player.globalLandingPoints();

		// var localPoint = this.runtime.map.globalToLocal(point.x, point.y);

		// if (this.helpers.hitTest(this.runtime.player, this.runtime.map)) {
		//this.debug('HIT!!');
		// }

		// update the stage:
		this.stage.update();
	};

	var file = (function() {
		var result;
		$.ajax({
			type: "GET",
			url: '/javascripts/map.txt',
			async: false,
			success: function(data){
			    result = data;
			}
		});
		return result;
	})();

	$(function() {
		$(".toggle-debug").click(function() {
			$('#debugCanvas').toggle();
		});

		$(".toggle-map").click(function() {
			$('.map').toggle();
		});

		game.map = file.split('|\r\n');
		var	$canvas = $("#canvas");
		$canvas.css('width', $canvas.prop('width'));
		$canvas.css('height', $canvas.prop('height'));
		game.init($canvas.get(0));

		var world = game.World(game.screenWidth, game.screenHeight);
		game.world = world;

		// var map = new game.Map(game.maps[0]);
		// game.runtime.map = map;

		var player = game.Player('player1', 'rgba(255,255,255,1)');
		player.x = 300;
		player.y = 100;
		player.vY = 2;
		player.setAimer(new game.Aimer());
		game.stage.addChild(player);
		game.runtime.player = player;
		$('body').on('click', function() {
			player.fire(game.stage.mouseX, game.stage.mouseY);
		});
		world.addObject(player);

		var enemy = game.Enemy('enemy1', 'rgba(0,0,255,1)');
		enemy.x = 400;
		enemy.y = 100;
		enemy.vY = 2;
		game.runtime.enemies = [];
		game.runtime.enemies.push(enemy);

		game.runtime.enemies.each(function(enemy) {
			world.addObject(enemy);
			game.stage.addChild(enemy);
		});

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

		world.addContactListener({
			BeginContact: function(obj1, obj2) {
				console.log('hit');
				if (obj1.type === 'player' && obj2.type === 'tile') {
					console.log(obj1);
					// console.log(obj1);
					// console.log(obj2);
					// game.debug('obj2:' + Math.round(obj2.x + obj2.width), true);
					// game.debug('obj1:' + Math.round(obj1.x - obj1.width/2));
					// game.debug('obj2:' + Math.round(obj2.x), true);
					// game.debug('obj1:' + Math.round(obj1.x + obj1.width/2));
					if (
						(Math.round(obj2.x + obj2.width) <= Math.round(obj1.x - obj1.width/2) ) ||
						(Math.round(obj1.x + obj1.width/2 ) <= Math.round(obj2.x) )
						) {
						console.log('blocked');
						obj1.blocked = true;
					}
				}

				if (obj1.type === 'bullet') {
					obj1.destroy();

					if (obj2.isEnemy) {
						obj2.hit();
					}
				}
			},
			EndContact: function(obj1, obj2) {
				obj1.blocked = false;
			}
		});

		game.stage.addChild(world.skin);

		createjs.Ticker.addListener(game);

		createjs.Ticker.addListener(world);

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
