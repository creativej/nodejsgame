(function() {
	"use strict";

	var root = this;

	function error(socket, msg) {
		socket.emit("error", {
			message: msg
		});
	}

	/**
	 *
	 */
	root.Visitor = function(socket, user) {
		var self = this;

		socket.emit("isVisitor");

		this.join = function(name, password) {
			var playground = self.getPlaygrounds().get(name);

			if (playground) {
				playground.addUser(socket, user, false);
			} else {
				self.create(name, password);
			}
		};

		this.create = function(name, password) {
			var playgrounds = self.getPlaygrounds();

			if (playgrounds.get(name)) {
				error(socket, "There is already a playground called " + name);
			} else {
				var playground = new root.Playground(name);
				playground.addUser(socket, user, true);
				playgrounds.add(playground);
			}
		};

		this.execute = function() {
			socket.on('joinOrCreate', function(){
				self.join.apply(self, Array.prototype.slice.call(arguments));
			});
		};

		this.getPlaygrounds = function() {
			return root.World.playgrounds;
		};
	};


}).cal(this);
