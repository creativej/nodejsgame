(function() {
	"use strict";

	var
		root = this,
		Box2D = require('./common/libs/box2dweb-2.1a3'),
		EventEmitter2 = require('./common/libs/eventemitter2').EventEmitter2,
		character = require('./common/character'),
		keystate = require('./common/keystate'),
		world = require('./common/box2dworld'),
		bullet = require('./common/bullet'),
		helpers = require('./common/helpers'),
		character = require('./common/character'),
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		meter = helpers.meter
		;

	/**
	 *
	 */
	root.User = function(socket, data, isHost) {
		var self = this;
		var bullets = [];

		this.isUser = true;
		this.isHost = isHost;
		this.data = data;
		this.data.isHost = isHost;
		this.data.mouse = null;
		this.keystate = keystate();
		this.character = character(
			data.hash,
			this.data.color || 'rgba(255,255,255,1)'
		);

		this.character.x = (Math.random() * 400) + 50  ;
		this.character.y = (Math.random() * 100) + 100;
		this.character.vY = 2;

		this.character.on('hit.player', function(health) {
			console.log('HIT!!!');
			console.log('HIT!!!');
			console.log('HIT!!!');
			console.log('HIT!!!');
			self.broadcast('hit.player.server', true, health);
		});

		this.init = function() {
			console.log('init user: ' + data.name);
			world.addObject(
				this.character,
				character.constructBody,
				character.constructFixture
			);

			this.broadcast('joined.user', false, this.toRawData());
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
			world.destroyObject(this.character);

			bullets.each(function(bullet) {
				world.destroyObject(bullet);
			});

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

		this.setKeyDown = function(keys) {
			this.keystate.keysDown = keys;
		};

		this.resolveActions = function() {
			var keystate = this.keystate;
			var player = this.character;

			if (!keystate.keysDown.length) {
				return player.goingTo('stop moving');
			}

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
		};

		this.fire = function(data) {
			data.userHash = this.get('hash');
			var b = bullet(data);
			world.addObject(b);

			b.on('destroy', function() {
				world.destroyObject(this);
			});

			bullets.push(b);
		};
	};

	root.User.prototype = new EventEmitter2();

}).call(this);
