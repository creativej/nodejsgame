module.exports = {
	meter: function(pixels) {
		return pixels / 30;
	},
	pixel: function(meters) {
		return meters * 30;
	}
};
