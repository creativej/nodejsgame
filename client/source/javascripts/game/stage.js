var game = game || {};

(function(window, app, game, createjs) {
	game.stage = function() {
		var
			instance = {},
			actors = []
			;

		instance.init = function(canvas) {
			this.canvas = canvas;
			this.stage = new createjs.Stage(canvas);
			this.stage.snapPixelsEnabled = true;
			this.width = parseInt(canvas.width, 10);
			this.height = parseInt(canvas.height, 10);

			createjs.Ticker.useRAF = true;
			// Best Framerate targeted (60 FPS)
			createjs.Ticker.setFPS(30);
		};

		instance.drawMap = function(data) {
			var container = new createjs.Container();

			data.each(function(bound) {
				container.addChild(game.tile(bound));
			});

			this.stage.addChild(container);

			return this;
		};

		instance.drawPlayer = function(data) {
			var player = game.Player(data);
			actors.push(player);
			this.stage.addChild(player);
			return this;
		};

		instance.updateActors = function(data) {
			data.each(function(actor) {
				var match = actors.find(function(n) {
					return n.hash === actor.hash;
				});

				if (match) {
					Object.merge(match, actor, false, true);
				}
			});
		};

		instance.tick = function() {
			this.stage.update();
		};

		return instance;
	}();

	$(function() {
		$(".toggle-debug").click(function() {
			$('#debug-canvas').toggle();
		});

		$(".toggle-map").click(function() {
			$('.map').toggle();
		});

		var	$canvas = $("#canvas");
		$canvas.css('width', $canvas.prop('width'));
		$canvas.css('height', $canvas.prop('height'));
		game.stage.init($canvas.get(0));

		createjs.Ticker.addListener(game.stage);
	});
}(window, app, game, createjs));
