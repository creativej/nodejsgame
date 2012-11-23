var game = game || {};

(function($, game, createjs) {
	'use strict';

	var KeyState = {
		keys: {
			'w': 87,
			'a': 65,
			's': 83,
			'd': 68
		},
		keysDown: [],
		down: function(keyCode) {
			this.keysDown.push(keyCode);
		},
		up: function(keyCode) {
			this.keysDown.remove(keyCode);
		},
		isKeyCodeDown: function(keyCode) {
			return this.keysDown.indexOf(keyCode) > -1;
		},
		isDown: function(letter) {
			return this.keysDown.indexOf(this.keys[letter]) > -1;
		}
	};

	game.KeyState = KeyState;

	$(function() {
		$('body').keydown(function(e) {
			if (!KeyState.isKeyCodeDown(e.keyCode)) {
				KeyState.down(e.keyCode);
			}
		});

		$('body').keyup(function(e) {
			KeyState.up(e.keyCode);
		});
	});
})($, game, createjs);
