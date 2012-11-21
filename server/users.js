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

		this.each = function(callback) {
			for (var hash in list) {
				if (list[hash]) {
					callback(list[hash], hash);
				}
			}

			return this;
		};

		this.raw = function() {
			return _.map(list, function(user) {
				return user.data;
			});
		};
	};
}).call(this);
