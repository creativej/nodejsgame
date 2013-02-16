(function() {
	'use strict';

	//Method for animating
	// function update(connections) {
	// 	world.Step(
	// 	1 / fps //frame-rate
	// 	, 10 //velocity iterations
	// 	, 10 //position iterations
	// 	);

	// 	io.sockets.emit('css', drawDOMObjects());
	// 	world.ClearForces();
	// }
	module.exports = function() {
		var game = {
			BOUNDARY: 0x0001,
			PLAYER: 0x0002,
			ENEMY: 0x0004,
			BULLET: 0x0008
		};

		return game;
	};
}());
