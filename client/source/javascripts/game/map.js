var game = game || {};

(function(game, createjs) {
	'use strict';

	function tile(xStep, yStep, tWidth, tHeight) {
		var	t = game.helpers.rect(tWidth, tHeight, "rgba(50,50,50,1)");

		t.x = xStep * tWidth;
		t.y = yStep * tHeight;
		return t;
	}

	function Map(data) {
		this.initialize(data);
	}

	Map.prototype = new createjs.Container();

	Map.prototype.parent_initialize = Map.prototype.initialize;

	Map.prototype.initialize = function(data) {
		var
			tWidth = game.screenWidth/data[0].length,
			tHeight = game.screenHeight/data.length,
			map = this
			;

		data.each(function(value, yStep) {
			value.each(function(block, xStep) {
				if (block === '#') {
					var t = tile(xStep, yStep, tWidth, tHeight);
					map.addChild(t);
				}
			});
		});
	};

	game.Map = Map;
})(game, createjs);
