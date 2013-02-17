//= require common/libs/sugar-1.3.6.min
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
//= require game/player
//= require game/stage

(function($, game, window, app) {
	app.onReady(function() {
		var world = window.common.world;

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

		world.on('tick', function() {
			game.stage.updateActors(this.getActorsData());
		});

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
