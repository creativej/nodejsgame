var mapEditor = mapEditor || {};

(function(window, $) {
	var mapEditor = function($el) {
		var $target;
		$el.on('click', '.tile', function() {
			if ($target) {
				$target = null;
			} else {
				$target = $(this);
				$target.addClass('selected');
			}
			return false;
		});

		$el.mousemove(function(e) {
			if ($target) {
				var parentOffset = $(this).parent().offset();
				//or $(this).offset(); if you really just want the current element's offset
				var relX = e.pageX - parentOffset.left - $target.width()/2;
				var relY = e.pageY - parentOffset.top - $target.height()/2;

				$target.css('left', relX);
				$target.css('top', relY);
			}
			return false;
		});

		$el.find('.add').click(function() {
			$el.find('.stage').append('<div class="tile"></div>');
		});
	};

	$(function() {
		mapEditor($('.map'));
	});
})(window, jQuery);