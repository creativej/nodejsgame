
root.SharedObject = function(_socket, _id) {
	var 
		self = this,
		_shared = [],
		_data;

	_socket.emit(this.getEvent('init'));

	function _set(name, value) {
		_data[name] = value;
	}

	this.share = function(props) {
		for (var i = props.length - 1; i >= 0; i--) {
			var name = props[i];
			_share.push(name);
			_socket.on(self.getEvent(name + ".changed"), function(value) {
				self.set(name, value);
			});
		};
	}

	this.set = function(name, value) {
		_data[name] = value;
		_socket.emit(self.getEvent(name + ".changed"), value);
	}

	this.get = function(name) {
		return self._data[name];
	}

	this.getEvent = function(name) {
		return _id + ":" + name;
	}
}
