(function($, app) {
	app.components = app.components || {};
	app.components.mouse = function(user) {
		var
			instance = {},
			$el
			;

		var id = 'mouse-' + user.hash;

		if ($("#" + id).length === 0) {
			$el = $("<div id='" + id + "' class='mouse'></div>");

			$("body").append($el);
		}

		console.log($el);

		function clickHint() {
			return $('<span class="hint"></span>');
		}

	    instance.update = function(mouse) {
			$el.css('left', mouse.x);
			$el.css('top', mouse.y);

			return instance;
	    };

	    instance.showClick = function(mouse) {
			var $hint = clickHint();
			$("body").append($hint);
			$hint.css('left', mouse.x);
			$hint.css('top', mouse.y);
			$.when($hint.animate({
				width: 30,
				height: 30,
				left: mouse.x - 15,
				top: mouse.y - 15,
				opacity: 0
			}, 'fast')).done(function() {
				$(this).remove();
			});
	    };

	    return instance;
	};
})($, app);
