app.users = function($, app) {
	"use strict";
	var
		instance = {},
		$instance = $(instance),
		list = {},
		length
		;

	instance.getByHash = function(hash) {
		return list[hash];
	};

	instance.add = function(user) {
		list[user.hash] = user;
		$instance.trigger('added');
		length++;
	};

	instance.remove = function(user) {
		delete list[user.hash];
		length--;
		$instance.trigger('removed');
	};

	instance.getLength = function() {
		return list.length;
	};

	return instance;
};
