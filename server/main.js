var
	Rooms = require('./rooms').Rooms,
	World = require('../server/world.js').World;

World(8001, Rooms);
