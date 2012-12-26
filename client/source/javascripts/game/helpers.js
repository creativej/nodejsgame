var game = game || {};

(function(window, game, createjs) {
	"use strict";

	game.helpers = {};

	game.helpers.meter = function(pixels) {
		return pixels / 30;
	};

	game.helpers.pixel = function(meters) {
		return meters * 30;
	};

	game.helpers.rect = function(width, height, color) {
		return new createjs.Shape(new createjs.Graphics().beginFill(color).rect(0, 0, width, height));
	};

	game.helpers.hitTest = function(obj, target) {
		var objPoint = obj.localToGlobal();
		var targetObjectPoint = target.globalToLocal(objPoint.x, objPoint.y);

		return target.hitTest(targetObjectPoint.x, targetObjectPoint.y);
	}
})(window, game, createjs);
