var game = game || {};

(function(window, game, createjs) {
	"use strict";

	game.helpers = {};

	game.helpers.rect = function(width, height, color) {
		return new createjs.Shape(new createjs.Graphics().beginFill(color).rect(0, 0, width, height));
	};

	game.helpers.generateMap = function(data) {
		function tile(xStep, yStep, tWidth, tHeight) {
			var	t = game.helpers.rect(tWidth, tHeight, "rgba(50,50,50,1)");

			t.x = xStep * tWidth;
			t.y = yStep * tHeight;
			return t;
		}

		var
			tWidth = game.screenWidth/data[0].length,
			tHeight = game.screenHeight/data.length,
			map = new createjs.Container()
			;


		data.each(function(value, yStep) {
			value.each(function(block, xStep) {
				if (block === '#') {
					map.addChild(tile(xStep, yStep, tWidth, tHeight));
				}
			});
		});

		return map;
	};
})(window, game, createjs);
