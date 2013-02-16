(function($, app) {
	'use strict';

	var userlist;

	app.onReady(function() {
		userlist = app.modules.UserList(
			$('#userlist')
		);
	});

	app.on('populated.room', function(e, data) {
		userlist.populate(data.list);
	});

	app.on('added.user.room', function(e, data) {
		userlist.add(data.user);
	});

	app.on('removed.user.room', function(e, data) {
		userlist.remove(data.user);
	});

	app.components.userlist = userlist;
}(jQuery, app));
