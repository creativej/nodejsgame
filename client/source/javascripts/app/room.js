var app = app || {};

app.Room = (function($, app, io) {
	"use strict";

	var
		instance = {},
		$instance = $(instance),
		users = app.users($, app),
		socket,
		currentUser
		;

	instance.init = function(socket) {
		socket.emit("userjoined", this.getCurrentUser());

		socket.on('disconnect', function(user) {
			$instance.trigger('disconnect', user);
		});

		// socket.on('joined', function(user) {
		// 	instance.addUser.call(instance, user);

		// 	if (user.hash != instance.user.data.hash) {
		// 		instance.socket.on(user.hash + ".mouse.changed", function(value) {
		// 			user.mouse = value;
		// 			$instance.trigger('mouse.changed', user);
		// 		});
		// 	}
		// });

		// socket.on('userlist', function(users) {
		// 	$(instance).trigger('userlist', { users: users });

		// 	$.each(users, function(user) {
		// 		if (user.hash != instance.user.data.hash) {
		// 			instance.socket.on(user.hash + ".mouse.changed", function(value) {
		// 				user.mouse = value;
		// 				$instance.trigger('mouse.changed', user);
		// 			});
		// 		}
		// 	});
		// });

		// socket.on("isActive", function() {
		// 	instance.activateUser.call(instance);
		// });

		socket.on("joined", function(user) {
			if (currentUser.hash !== user.hash) {
				$instance.trigger('joined', user);
			}
			// instance.setVisitor.call(instance);
		});


	};

	instance.removeUser = function(user) {
		users.remove(user);
	};

	instance.addUser = function(user) {
		users.add(user);
	};

	instance.getUser = function(user) {
		if (user.hash) {
			return users.get(user.hash);
		} else {
			return users.get(user);
		}
	};

	instance.getCurrentUser = function() {
		return currentUser || (currentUser = {
			hash: app.helpers.guidGenerator()
		});
	};

	// instance.activateUser = function() {
	// 	activeUser = new app.User(socket, instance.getUser());
	// };

	// instance.getActiveUser = function() {
	// 	return activeUser;
	// };

	instance.getUserEvent = function(name) {
		return activeUser.getHash() + " " + name;
	};

	instance.on = function(eventName, callback) {
		$instance.on(eventName, callback);
	};

	return instance;
});
