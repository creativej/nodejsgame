/*
This is a hack to make window object available in nodejs
for easy export of modules client & server side
 */
module.exports = function(module, name, func) {
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = func;
	}

	if (typeof window !== 'undefined') {
		window.common = window.common || {};
		window.common[name] = func;
	}
};
