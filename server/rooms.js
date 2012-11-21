(function() {
	"use strict";

	var
		root = this,
		_ = require('./libs/underscore')
		;

	/**
	 *
	 */
	root.Rooms = {
		data: [],

		add: function(room) {
			this.data.push(room);
		},

		get: function(name) {
			var result = null;

			_.each(this.data, function(room){
				if (room.name === name) {
					result = room;
					return;
				}
			});

			return result;
		},

		length: function() {
			return this.data.length;
		},

		reset: function() {
			this.data = [];
		}
	};

}).call(this);
