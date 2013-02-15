(function() {
	"use strict";

	var
		root = this,
		EventEmitter2 = require('./libs/eventemitter2').EventEmitter2
		;

	/**
	 *
	 */
	root.User = function(socket, data, isHost) {
		var self = this;

		this.isUser = true;
		this.isHost = isHost;
		this.data = data;
		this.data.isHost = isHost;
		this.data.mouse = null;

		this.init = function() {
			this.emit('joined', self.data);

			return self;
		};

		this.setHost = function() {
			this.data.isHost = true;
			this.isHost = true;
		};

		this.activate = function(userData) {
			this.set('name', userData.name);
			this.set('isActive', true);
			this.broadcast('activated', true);
		};

		this.update = function(prop, value) {
			self
				.set(prop, value)
				.broadcast('changed')
				;
		};

		this.socketEmit = function(name, data) {
			socket.emit(name, data || {});
		};

		this.get = function(name) {
			if (self.data[name]) {
				return self.data[name];
			} else {
				return null;
			}
		};

		this.set = function(name, value) {
			self.data[name] = value;

			return self;
		};

		this.remove = function() {
			this.removeAllListeners('joined');
		};

		this.broadcast = function(name, includeSelf, data) {
			socket.broadcast.emit(name, self.data, data);

			if (includeSelf) {
				this.socketEmit(name, self.data, data);
			}
		};

		this.setHost = function(user) {
			if (!this.host) {
				user.setHost();
				this.host = user;
			}
		};
	};

	root.User.prototype = new EventEmitter2();

}).call(this);
