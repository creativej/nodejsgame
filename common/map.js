	var	tile = require('./tile');
	var bounds = [];
	function createBounds(world, width, height) {
		var
			left = tile({
				x: -10,
				y: 0,
				width: 10,
				height: height
			}).addToWorld(world),
			right = tile({
				x: width,
				y: 0,
				width: 10,
				height: height
			}).addToWorld(world),
			bottom = tile({
				x: 0,
				y: height - 10,
				width: width,
				height: 10
			}).addToWorld(world)
			;

		bounds.push(left);
		bounds.push(right);
		bounds.push(bottom);
	}

	require('./requireable')(module, 'map', {
		create: function(world, width, height) {
			createBounds(world, width, height);
		},
		toRawData: function() {
			return bounds.map(function(bound) {
				return bound.toJson();
			});
		}
	});
