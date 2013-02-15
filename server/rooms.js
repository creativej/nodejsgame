(function() {
	"use strict";

	require('../common/libs/sugar-1.3.6.min.js');

	var
		root = this
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

			this.data.each(function(room) {
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
