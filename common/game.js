
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

	require('./requireable')(module, 'game', {
		BOUNDARY: 0x0001,
		PLAYER: 0x0002,
		BULLET: 0x0004,
		BOULDER: 0x0008,
		PLAYER_FEET: 0x0010
	});

