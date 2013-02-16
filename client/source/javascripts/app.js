(function ($, window) {
	var appReady = $.Deferred();

	// function socketTriggerApp(event, socket, app) {
	// 	socket.on(event, function() {
	// 		console.log(Array.prototype.slice.call(arguments)[0]);
	// 		$(app).trigger.call(app, Array.prototype.slice.call(arguments)[0]);
	// 	});
	// }

	var app = {
		socket: {},
		ready: function() {
			this.socket = io.connect("http://localhost:8001");
			console.log('app is ready');

			this.socket.on('populate.room', function(userlist) {
				$app.trigger('populate.room', {
					users: userlist
				});
			});

			this.socket.on('joined.user', function(user) {
				$app.trigger('joined.user.server', {
					user: user
				});
			});

			this.socket.on('disconnect.user', function(user) {
				$app.trigger('disconnect.user.server', {
					user: user
				});
			});

			this.socket.on('ready.map', function(data) {
				$app.trigger('draw.map', {
					data: data
				});
			});

			this.socket.on('update.actors', function(actors) {
				$app.trigger('update.actors.server', {
					data: actors
				});
			});

		// this.socket.on('activated', function(userData) {
		// 	$app.trigger('activated', userData);
		// });
			// socketTriggerApp('init.userlist', this.socket, this);
			// socketTriggerApp('activated', this.socket, this);
			// socketTriggerApp('populate.room', this.socket, this);
			appReady.resolve();
		},

		components: {},
		modules: {},
		helpers: {}
	};

	var $app = $(app);

	app.onReady = function(callback) {
		appReady.done($.proxy(callback, this));
	};

	app.on = function(name, callback) {
		$app.on(name, callback);

		return app;
	};

	window.app = app;
}(jQuery, window));
