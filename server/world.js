(function() {
	"use strict";

	var
		playground = "default",
		root = this,
		Room = require('./room').Room,
		firstTime = true
		;

	root.connection = function(socket, rooms) {
		var
			room = rooms.get(playground),
			user
			;

		socket.on("join.user", function(newUser){
			user = room.getUser(newUser.hash);

			if (user) {
				//
			} else {
				user = room.join(newUser, socket);

				if (room.getUsers().length() === 1) {
					room.setHost(user);
				}
			}

			socket.emit('populate.room', room.getUsers().raw());
		});

		socket.on('disconnect', function() {
			room.disconnectUserBySocket(socket);
		});

		// socket.on('mousemove', function (mouse) {
		// 	user.update('mouse', mouse);
		// });

		// socket.on('mouseclick', function(elementPath) {
		// 	user.broadcast('mouseclick', false, elementPath);
		// });

		firstTime = false;
	};

	root.World = function(port, rooms) {
		var
			io = require('socket.io').listen(port)
			;

		rooms.add(new Room(playground));
		io.sockets.on('connection', function(socket) { root.connection(socket, rooms); });
	};

}).call(this);
