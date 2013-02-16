var app = app || {};

function parent($el) {
	var
		$parent = $el.parent(),
		name = $parent.get(0).localName.toLowerCase()
		;

	if (name === "body") {
		return false;
	} else {
		return $parent;
	}
}

function elementPath($el) {
	var route = [];

	while ($el) {
		route.push({
			tag: $el.get(0).localName,
			pos: $el.index()
		});

		$el = parent($el);
	}

	return route;
}

app.user = function($, app, socket, user) {
	var instance = {}, mouse;
	instance.data = user;
	instance.hash = user.hash;
	instance.isActive = true;
	instance.isUser = true;

	instance.getHash = function() {
		return data.hash;
	};

	instance.activate = function() {
		if (instance.isHost()) {
			//action
		}
	};

	instance.isHost = function() {
		return instance.data.isHost;
	};

	return instance;
};
