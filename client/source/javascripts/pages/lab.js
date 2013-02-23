//= require common/libs/sugar-1.3.6.min
//= require common/bundled/keystate
//= require libs/easeljs-0.6.0.min
//= require libs/tweenjs-3.0.0.min
//= require libs/jquery-1.7.1.min
//= require app
//= require app/modules/userlist
//= require app/helpers
//= require app/user
//= require app/users
//= require app/room
//= require app/components/userlist
//= require game/helpers
//= require game/tile
//= require game/aimer
//= require game/bullet
//= require game/player
//= require game/boulder
//= require game/stage


(function($, app, game) {
	function getCurrentUser(username) {
		return {
			name: username,
			hash: app.helpers.guidGenerator()
		};
	}

	app.onReady(function() {
		var
			userList = app.components.userList,
			room = app.Room(socket),
			socket = app.socket,
			currentUser = getCurrentUser($('#userlist').data('currentuser'))
			;

		socket.emit('join.user', currentUser);

		app.on('populate.room', function(e, data) {
			room.populate(data.users);

			data.users.each(function(user) {
				if (user.hash === currentUser.hash) {
					var player = game.stage.drawPlayer(user);

					console.log(player);
					player.onFire = function(data) {
						game.stage.drawBullet(data);
						socket.emit('fire.player', data);
					};
				} else {
					game.stage.drawEnemy(user);
				}
			});
		});

		app.on('joined.user.server', function(e, data) {
			room.addUser(data.user);

			game.stage.drawEnemy(data.user);
		});

		app.on('disconnect.user.server', function(e, data) {
			room.removeUser(data.user);
			game.stage.removePlayer(data.user);
		});

		app.on('draw.map', function(e, data) {
			game.stage.drawMap(data.data);
		});

		app.on('update.actors.server', function(e, data) {
			game.stage.updateActors(data.data);
		});
	});

	$(function(){
		app.ready();
	});


		// room.on('disconnect', function(e, user) {
		// 	$(app).trigger('disconnect.user', user);
		// });


	// room.on('disconnect', function(e, user) {
		//     userList.remove(user);
		//     room.removeUser(user);
		//     window.console.log('disconnect');
		// });

		// socket.on('userlist', function(users) {
		//     var currentUser = room.getCurrentUser();
		//     userList.set(users);
		//     userList.setCurrentUser(currentUser);

		//     $.each(users, function(idx, userData) {
		//         var user = room.getUser(userData.hash);
		//         if (!user) {
		//             user = app.user($, app, socket, userData);
		//             room.addUser(user);
		//         }
		//     });
		// });

		// socket.on('changed', function(userData) {
		//     var user = room.getUser(userData.hash);

		//     if (!user.isActive) {
		//         return;
		//     }

		//     if (user.hash != room.getCurrentUser().hash) {
		//         user.setMouse(userData.mouse);
		//     }
		// });

		// socket.on('activated', function(userData) {
		//     var
		//         user = app.user($, app, socket, userData),
		//         currentUser = room.getCurrentUser()
		//         ;

		//     if (userData.hash === currentUser.hash) {
		//         $('body').addClass('activated');
		//         $('.stage .title').text(userData.name + ' in da house!');
		//         currentUser = user;
		//         currentUser.activate(room);
		//     } else {
		//         userList.add(userData);
		//         room.addUser(user);
		//     }

		// });

		// socket.on('mouseclick', function(userData, elementPath) {
		//     var user = room.getUser(userData.hash);

		//     if (!user.isActive) {
		//         return;
		//     }

		//     var mouse = userData.mouse;
		//     // instance.getMouse().showClick(mouse);
		//     elementPath.reverse();

		//     var $dom = $('body');
		//     $.each(elementPath, function(idx, element) {
		//         $dom = $dom.children("*:eq(" + element.pos + ")");
		//     });
		//     console.log($dom);
		//     console.log($dom.length);
		//     $dom.click();
		// });



}(jQuery, app, game));
