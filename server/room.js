(function() {
	"use strict";
	var
		User = require('./user.js').User,
		Users = require('./users.js').Users,
		root = this
		;

	/**
	 *
	 */
	root.Room = function(name) {
		var
			self = this,
			users = new Users()
			;

		this.name = name;
		this.host = null;

		this.disconnectUser = function(user) {
			this.removeUser(user);
			user.broadcast('user.disconnect');
			if (this.host.get('hash') === user.get('hash')) {
				this.host = null;
			}
			user.remove();

			console.log('disconnected');
		};

		this.removeUser = function(user) {
			users.remove(user);
		};

		this.addUser = function(user) {
			users.add(user);
		};

		this.join = function(user, socket) {
			var
				self = this
				;

			if (socket) {
				user = new User(socket, user);

				socket.on('disconnect.user', function () {
					self.disconnectUser(user);
				});
			}

			user.on('joined.user', function() {
				this.broadcast('joined.user', true);
			});

			this.addUser(user);

			user.init();

			return user;
		};

		this.getUser = function(user) {
			if (user.isUser) {
				return users.get(user.get('hash'));
			} else {
				return users.get(user);
			}
		};

		this.getUsers = function() {
			return users;
		};
	};
}).call(this);
