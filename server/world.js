(function() {
	"use strict";

	var
		playground = "default",
		root = this,
		Room = require('./room').Room,
		boulder = require('./common/boulder'),
		world = require('./common/box2dworld'),
		helpers = require('./common/helpers'),
		firstTime = true
		;

	root.connection = function(socket, rooms) {
		var
			room = rooms.get(playground),
			user
			;

		socket.emit('ready.map', world.getMap().toRawData());

		world.on('tick', function() {
			room.getUsers().each(function(user) {
				user.resolveActions();
			});

			this.getActors().each(function(actor) {
				if (actor.type === 'bullet' && !actor.getBody().IsAwake()) {
					actor.destroy();
				}
			});

			var actorsData = this.getActorsData();

			if (actorsData.length) {
				socket.emit('update.actors', actorsData);
			}

			if (Math.random() < 0.001) {
				var rock = boulder({
					hash: 'boulder-' + helpers.guidGenerator(),
					x: Math.random() * 300 + 50,
					y: 0,
					width: 50
				});

				world.addObject(rock);
			}
		});

		socket.on("join.user", function(newUser){
			user = room.getUser(newUser.hash);

			if (!user) {
				user = room.join(newUser, socket);
			}

			socket.emit('populate.room', room.getUsers().toRawData());
		});

		socket.on('disconnect', function() {
			room.disconnectUserBySocket(socket);
		});

		socket.on('keydown', function(keys) {
			var user = room.getUserBySocket(socket);

			if (user) {
				user.setKeyDown(keys);
			}
		});

		socket.on('fire.player', function(data) {
			var user = room.getUserBySocket(socket);

			if (user) {
				user.fire(data);
			}
		});

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
