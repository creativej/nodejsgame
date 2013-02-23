(function() {
	"use strict";

	var root = this;

	root.Users = function() {
		var
			list = {},
			_ = require('./libs/underscore'),
			length = 0
			;

		this.add = function(user) {
			if (!this.get(user)) {
				list[user.get('hash')] = user;
				length++;
				console.log('user created: ' + user.get('hash'));
				console.log('total users: ' + length);
				return true;
			} else {
				console.log('no user created');
				return false;
			}
		};

		this.remove = function(user) {
			delete list[user.get('hash')];
			length = Math.max(0, length-1);
		};

		this.get = function(hash) {
			return list[hash];
		};

		this.getBySocket = function (socket) {
			var result;
			this.each(function(user) {
				if (user.getSocket().id === socket.id) {
					result = user;
					return false;
				}
			});

			return result;
		};

		this.each = function(callback) {
			for (var hash in list) {
				if (list[hash]) {
					if (callback(list[hash], hash) === false) { return false; }
				}
			}

			return this;
		};

		this.length = function() {
			return length;
		};

		this.toRawData = function() {
			return _.map(list, function(user) {
				return user.toRawData();
			});
		};
	};
}).call(this);
