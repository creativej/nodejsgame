(function(window, document, app) {
	app.helpers.guidGenerator = function() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};

	Array.prototype.remove = function(e) {
	    var t, _ref;
	    if ((t = this.indexOf(e)) > -1) {
	        return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
	    }
	};

	app.helpers.getPos = function(e) {
		var posx = 0;
		var posy = 0;

		if (!e) {
			e = window.event;
		}

		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		return { x: posx, y: posy };
	};
}(window, document, app));
