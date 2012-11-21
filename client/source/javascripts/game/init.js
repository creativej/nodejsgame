var game = game || {};

(function(window, $, game, createjs) {
	function image(path) {
		var img = new Image();
		img.src = path;

		return img;
	}

	game.init = function(canvas) {
		game.stage = new createjs.Stage(canvas);

		createjs.Ticker.addListener(window);
		createjs.Ticker.useRAF = true;
		// Best Framerate targeted (60 FPS)
		createjs.Ticker.setFPS(30);
	};

	$(function() {
		game.stage = new createjs.Stage(document.getElementById('canvas'));
		game.images = {};
		game.images.star = image('/images/stars.png');
		game.sprites = {};
		game.sprites.star = new createjs.SpriteSheet({
			images: [game.images.star],
			frames: { width: 31, height: 52, regX: 0, regY: 0},
			animations: {
				fall: [0, 6, 'fall']
			}
		});

		var starAnimation = new createjs.BitmapAnimation(game.sprites.star);
		starAnimation.gotoAndPlay('fall');
		starAnimation.name = 'star1';
		starAnimation.direction = 90;
		starAnimation.vY = 4;
		starAnimation.x = Math.random()*400;
		starAnimation.y = 0;
		starAnimation.currentFrame = 0;
		game.stage.addChild(starAnimation);
		// game.stage.update();



		createjs.Ticker.addListener(window);
		createjs.Ticker.useRAF = true;
		// Best Framerate targeted (60 FPS)
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addListener(function() {
			// Hit testing the screen width, otherwise our sprite would disappear
			// if (starAnimation.x >= 400 - 16) {
				// We've reached the right side of our screen
				// We need to walk left now to go back to our initial position
				// starAnimation.direction = -90;
			// }

			// if (starAnimation.x < 16) {
				// We've reached the left side of our screen
				// We need to walk right now
				// starAnimation.direction = 90;
			// }

			// Moving the sprite based on the direction & the speed

			if (starAnimation.y >= 250) {
				starAnimation.y = 0;
				starAnimation.x = Math.random() * 400;
			}

			starAnimation.y += starAnimation.vY;

			// update the stage:
			game.stage.update();

		});
	});
})(window, $, game, createjs);
