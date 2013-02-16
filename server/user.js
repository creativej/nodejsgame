(function() {
	"use strict";

	var
		root = this,
		EventEmitter2 = require('./common/libs/eventemitter2').EventEmitter2,
		character = require('./common/character'),
		world = require('./common/box2dworld')
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

		this.character = character(
			data.name,
			this.data.color || 'rgba(255,255,255,1)'
		);

		this.character.x = 300;
		this.character.y = 300;
		this.character.vY = 2;


		this.init = function() {
			world.addObject(this.character);

			this.emit('joined', this.toRawData());

			return self;
		};

		this.setHost = function() {
			this.data.isHost = true;
			this.isHost = true;
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

		this.getSocket = function() {
			return socket;
		};

		this.setCharacter = function(character) {
			this.character = character(this.get('name'), 'rgba(255,255,255,1)');
			return this;
		};

		this.toRawData = function() {
			return Object.merge(this.data, this.character.toRawData(), false, true);
		};
	};

	root.User.prototype = new EventEmitter2();

}).call(this);
