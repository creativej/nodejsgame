require('./requireable')(module, 'helpers', {
	meter: function(pixels) {
		return pixels / 30;
	},
	pixel: function(meters) {
		return meters * 30;
	},
	guidGenerator: function() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}
});
