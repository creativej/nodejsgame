//= require common/libs/sugar-1.3.6.min
//= require common/bundled/keystate
//= require libs/easeljs-0.6.0.min
//= require libs/jquery-1.7.1.min
//= require common/testbundle
//= require app
//= require app/modules/userlist
//= require app/helpers
//= require app/user
//= require app/users
//= require app/room
//= require app/components/userlist
//= require game/helpers
//= require game/tile
//= require game/bullet
//= require game/aimer
//= require game/boulder
//= require game/player
//= require game/stage

(function($, game, window, app) {
	app.onReady(function() {
		var world = window.common.world;
		var keystate = app.keystate;
		world.setDebug(document.getElementById('debug-canvas'));

		game.stage.drawMap(world.getMap().toRawData());

		var player = window.common.character(
			'player',
			'rgba(255,255,255,1)'
		);
		player.x = 300;
		player.y = 300;
		player.vY = 2;
		world.addObject(player);
		game.stage.drawPlayer(player.toRawData());

		var playerSkin = game.stage.getPlayer();
		playerSkin.onFire = function(data) {
			game.stage.drawBullet(data);
			var bullet = window.common.bullet(data);

			world.addObject(bullet);
			// socket.emit('fire.player', data);
		};

		world.on('tick', function() {
			if (keystate.isDown('a')) {
				player.goingTo('move left');
			}

			if (keystate.isDown('d')) {
				player.goingTo('move right');
			}

			if (keystate.isDown('w')) {
				player.goingTo('jump');
			}

			if (
				(!keystate.isDown('a') && !keystate.isDown('d')) ||
				(!player.landed && player.blocked)
			) {
				player.goingTo('stop moving');
			}

			game.stage.updateActors(this.getActorsData());
		});

		// console.log('create boulder!');
		var rock = window.common.boulder({
			hash: app.helpers.guidGenerator(),
			x: Math.random() * 300 + 100,
			y: 0,
			width: 50
		});
		world.addObject(rock);


		// app.on('draw.map', function(e, data) {
		// });

		// app.on('update.actors.server', function(e, data) {
		// 	game.stage.updateActors(data.data);
		// });

		// $(app).trigger('draw.map', {
		// 	data: world.getMap().toRawData()
		// });
	});

	$(function() {
		app.offlineReady();
	});

}(jQuery, game, window, app));
