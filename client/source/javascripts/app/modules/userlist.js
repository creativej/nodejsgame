(function($, app) {
	'use strict';

	app.modules.UserList = function($el) {
		var
			instance = {},
			$instance = $(instance)
			;

		function item(user) {
			var $user = $('<li class="user-' + user.hash + '">' + user.name + '</li>');
			return $user;
		}

		instance.populate = function(users) {
			$el.empty();
			$.each(users, function(idx, user) {
				instance.add(user);

				if (user.name === $el.data('currentuser')) {
					instance.setCurrentUser(user);
				}
			});
		};

		instance.add = function(user) {
			$el.append(item(user));
			return this;
		};

		instance.setCurrentUser = function(user) {
			var $user = this.get(user.hash);

			$user.addClass('current');
		};

		instance.get = function(hash) {
			return $el.find('.user-'+hash);
		};

		instance.remove = function(user) {
			var $user = $el.find('.user-' + user.hash);
			$user.remove();
			return this;
		};

		return instance;
	};
})($, app);
