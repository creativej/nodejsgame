(function($, app) {
	app.components = app.components || {};
	app.components.userList = function($el) {
		var
			instance = {},
			$instance = $(instance)
			;

		function item(user) {
			var $user = $('<li class="user-' + user.hash + '">' + user.name + '</li>');
			return $user;
		}

		instance.set = function(users) {
			$el.empty();

			$.each(users, function(idx, user) {
				if (user.isActive) {
					instance.add(user);
				}
			});
		};

		instance.add = function(user) {
			console.log('add user');
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
			console.log($user);
			console.log($user.length);
			$user.remove();
			return this;
		};

		return instance;
	};
})($, app);
