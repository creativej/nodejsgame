var game = game || {};

(function(window, app, game, createjs) {
	var keystate = app.keystate;
	game.stage = function() {
		var
			instance = {},
			actors = [],
			lastKeysDown = [],
			currentPlayer
			;

		instance.init = function(canvas) {
			this.canvas = canvas;
			this.stage = new createjs.Stage(canvas);
			this.stage.snapPixelsEnabled = true;
			this.width = parseInt(canvas.width, 10);
			this.height = parseInt(canvas.height, 10);

			createjs.Ticker.useRAF = true;
			// Best Framerate targeted (60 FPS)
			createjs.Ticker.setFPS(24);
		};

		instance.drawMap = function(data) {
			var container = new createjs.Container();

			data.each(function(bound) {
				container.addChild(game.tile(bound));
			});

			this.stage.addChild(container);

			return this;
		};

		instance.drawPlayer = function(data, isEnemy) {
			var player = game.Player(data);

			if (!isEnemy) {
				player.setAimer(new game.Aimer());
				currentPlayer = player;
			}

			player.on('died', function() {
				instance.removeActor(player.hash);

				instance.stage.removeChild(player);
			});

			actors.push(player);
			this.stage.addChild(player);
			return player;
		};

		instance.drawBoulder = function(data) {
			var boulder = game.boulder(data);
			console.log('draw boulder');
			actors.push(boulder);
			console.log(boulder);
			this.stage.addChild(boulder);
			return boulder;
		};

		instance.drawEnemy = function(data) {
			data.color = 'rbg(0,0,0,1)';
			return this.drawPlayer(data, true);
		};

		instance.removePlayer = function(data) {
			var p = this.findActor(data.hash);
			if (p) {
				p.die();
			}
		};

		instance.updateActors = function(data) {
			data.each(function(actor) {
				var match = instance.findActor(actor.hash);

				if (match) {
					// console.log(match.y);
					Object.merge(match, actor, false, true);
				} else {
					console.log('actor not found.. ');
					console.log(actor);
					if (actor.type === 'bullet') {
						instance.drawBullet({
							hash: actor.hash,
							from: {
								x: actor.x,
								y: actor.y
							}
						});
					} else if (actor.type === 'boulder') {
						instance.drawBoulder({
							hash: actor.hash,
							x: actor.x,
							y: actor.y,
							width: actor.width
						});
					}
				}
			});
		};

		instance.drawBullet = function(data) {
			var bullet = game.Bullet({
				hash: data.hash,
				color: data.color,
				x: data.from.x,
				y: data.from.y
			});
			this.stage.addChild(bullet);
			actors.push(bullet);

			return bullet;
		};

		instance.findActor = function(hash) {
			return actors.find(function(n) {
				return n.hash === hash;
			});
		};

		instance.removeActor = function(hash) {
			actors.remove(function(actor) {
				return actor.hash === hash;
			});
		};

		instance.getMousePos = function() {
			return {
				x: this.stage.mouseX,
				y: this.stage.mouseY
			};
		};

		instance.tick = function() {
			// if (!keystate.isKeyCodeDown(e.keyCode)) {
			// 	keystate.down(e.keyCode);
			// }

			// console.log(keystate.keysDown);
			// console.log(lastKeysDown.length + ' - ' + keystate.keysDown.length);
			// if (lastKeysDown != keystate.keysDown) {
			// 	console.log('new key');
			if(app.socket.emit) {
				app.socket.emit('keydown', keystate.keysDown);
			}
			// }

			if (currentPlayer) {
				currentPlayer.updateAim(this.stage.mouseX, this.stage.mouseY);
			}

			// lastKeysDown = keystate.keysDown;
			this.stage.update();
		};

		instance.getPlayer = function() {
			return currentPlayer;
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

		$('body').keydown(function(e) {
			if (!keystate.isKeyCodeDown(e.keyCode)) {
				keystate.down(e.keyCode);
			}
		});

		$('body').on('click', function() {
			var pos = game.stage.getMousePos();
			game.stage.getPlayer().fire(pos.x, pos.y);
		});

		$('body').keyup(function(e) {
			keystate.up(e.keyCode);
		});

		createjs.Ticker.addListener(game.stage);
	});
}(window, app, game, createjs));
