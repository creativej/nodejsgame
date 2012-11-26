var game = game || {};

(function($) {
	'use strict';

	var $console;

	$(function() {
		$console = $('.console');
	});

	game.debug = function(text, clear) {
		if (clear) {
			$console.text('');
		}
		$console.text($console.text() + text + '\n');
	};
})($);
