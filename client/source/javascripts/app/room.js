(function($, app){
	'use strict';

	app.Room = function(socket) {
		var
			instance = {},
			$instance = $(instance),
			users = app.users($, app),
			socket,
			currentUser,
			readyDeferred = $.Deferred()
			;


		instance.enter = function(user) {
			if (currentUser.hash !== user.hash) {
				$instance.trigger('joined', user);
			}
		};

		instance.populate = function(list) {
			list.each(function(user) {
				instance.addUser(user);
			});

			$(app).trigger('populated.room', {
				list: list
			});
		};

		instance.removeUser = function(user) {
			users.remove(user);
			$(app).trigger('removed.user.room', {
				user: user
			});
		};

		instance.addUser = function(user) {
			users.add(user);
			$(app).trigger('added.user.room', {
				user: user
			});
		};

		instance.getUser = function(user) {
			if (user.hash) {
				return users.get(user.hash);
			} else {
				return users.get(user);
			}
		};

		instance.getCurrentUser = function() {
			return currentUser;
		};
		// instance.getUserEvent = function(name) {
		// 	return currentUser.getHash() + " " + name;
		// };

		instance.on = function(eventName, callback) {
			$instance.on(eventName, callback);
		};

		instance.ready = function() {
			readyDeferred.resolve();
		};

		instance.onReady = function(callback) {
			readyDeferred.done($.proxy(callback, this));
		};

		return instance;
	};
}($, app));
