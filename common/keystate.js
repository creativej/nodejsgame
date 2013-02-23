var keyState = function(keysDown) {
	var instance = {
		keys: {
			'w': 87,
			'a': 65,
			's': 83,
			'd': 68
		},
		keysDown: keysDown || [],
		down: function(keyCode) {
			if (match) {
				this.keysDown.push(keyCode);
			}
		},
		up: function(keyCode) {
			this.keysDown.remove(keyCode);
		},
		isKeyCodeDown: function(keyCode) {
			return this.keysDown.indexOf(keyCode) > -1;
		},
		isDown: function(letter) {
			if (letter) {
				return this.keysDown.indexOf(this.keys[letter]) > -1;
			} else {
				return this.keysDown.length;
			}
		}
	};

	return instance;
};



require('./requireable')(module, 'keystate', keyState);
