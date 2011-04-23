/*
 * ANS jQuery Bookmarklet launcher (v.1.0)
 *
 * A navalla suíza (http://idc.anavallasuiza.com/project/bookmarklet/)
 *
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 */

window.bookmarklet = {
	css: [],
	js: [],
	jquery: false,

	launch: function (file) {
		if (!file) {
			return false;
		}

		this.loadJS(file, false, function () {
			var options = window.bookmarklet.options;

			if (typeof(options.css) != 'object') {
				if (options.css) {
					options.css = [options.css];
				} else {
					options.css = [];
				}
			}
			if (typeof(options.js) != 'object') {
				if (options.js) {
					options.js = [options.js];
				} else {
					options.js = [];
				}
			}

			//Load css
			if (options.css.length) {
				for (var i in options.css) {
					window.bookmarklet.loadCSS(options.css[i], true);
				}
			}

			//Load jQuery
			if (options.jquery) {
				options.js.unshift(options.jquery);
			}

			//Load js
			if (options.js.length) {
				window.bookmarklet.loadMultipleJS(options.js, true, window.bookmarklet.ready);
			} else {
				window.bookmarklet.ready();
			}
			
			//Remove this element
			this.parentNode.removeChild(this);
		});
	},
	ready: function () {
		var options = window.bookmarklet.options;

		if (options.jquery) {
			if (!window.bookmarklet.jquery) {
				window.bookmarklet.jquery = jQuery.noConflict(true);
			}
			window.bookmarklet.jquery(options.ready);
		} else {
			options.ready();
		}
	},
	loadMultipleJS: function (files, register, onload) {
		if (files.length == 0) {
			if (onload) {
				onload();
			}
			
			return true;
		}

		this.loadJS(files.shift(), register, function () {
			window.bookmarklet.loadMultipleJS(files, register, onload);
		});
	},
	loadJS: function (file, register, onload) {
		if (this.inArray(file, this.js)) {
			if (onload) {
				onload();
			}
			
			return false;
		}
		
		if (register == true) {
			this.js.push(file);
		}
		
		var element = document.createElement('script');
		element.type = 'text/javascript';
		element.src = file;
		document.body.appendChild(element);
		
		if (onload) {
			element.onload = onload;
			
			element.onreadystatechange = function () {
				if (element.readyState == 'loaded' || element.readyState == 'complete') {
					element.onload();
				}
			}
		}
	},
	loadCSS: function (file, register) {
		if (this.inArray(file, this.css)) {
			return false;
		}
		
		if (register == true) {
			this.css.push(file);
		}
		
		var element = document.createElement('link');
		element.setAttribute('rel', 'stylesheet');
		element.setAttribute('type', 'text/css');
		element.setAttribute('href', file);

		document.getElementsByTagName('head')[0].appendChild(element);
		
		return element;
	},
	inArray: function (needle, haystack) {
		var key = '';
		
		for (key in haystack) {
			if (haystack[key] == needle) {
				return true;
			}
		}
		
		return false;
	}
};