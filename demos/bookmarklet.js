/*
 * ANS jQuery Bookmarklet launcher (v.3.0)
 *
 * A navalla suíza (http://idc.anavallasuiza.com/project/bookmarklet/)
 *
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 */

window.bookmarklet = {
	css: {},
	js: {},
	jQuery: false,

	launch: function (file) {
		if (!file) {
			return false;
		}

		this.loadJS(file, function () {
			var options = window.bookmarklet.options || {};

			window.bookmarklet.execute(options);
		});
	},
	execute: function (options) {
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
				window.bookmarklet.loadCSS(options.css[i]);
			}
		}

		//Load jQuery
		if (options.jquery) {
			options.js.unshift(options.jquery);
		}

		//Load js
		window.bookmarklet.loadMultipleJS(options.js, function () {
			if (options.jquery) {
				if (!window.bookmarklet.jQuery) {
					window.bookmarklet.jQuery = window.jQuery.noConflict(true);
				}

				window.bookmarklet.jQuery(options.ready);
			} else {
				options.ready();
			}
		});
	},
	loadMultipleJS: function (files, onload) {
		if (files.length == 0) {
			if (onload) {
				onload();
			}
			
			return true;
		}

		this.loadJS(files.shift(), function () {
			window.bookmarklet.loadMultipleJS(files, onload);
		});
	},
	loadJS: function (file, onload) {
		var element = this.loadedJS(file);

		if (element) {
			if (typeof onload == 'function') {
				onload.call(element);
			}

			return false;
		}

		element = document.createElement('script');
		element.type = 'text/javascript';
		element.src = file;

		if (!document.attachEvent) {
			element.onload = onload;
		} else if (typeof onload == 'function') {
			element.onreadystatechange = function () {
				if (element.readyState == 'complete' || element.readyState == 'loaded') {
					onload.call(element);
					element.onreadystatechange = null;
				}
			}
		}

		document.body.appendChild(element);

		this.js[file] = element;

		return element;
	},
	loadCSS: function (file) {
		if (this.loadedCSS(file)) {
			return false;
		}

		var element = document.createElement('link');
		element.setAttribute('rel', 'stylesheet');
		element.setAttribute('type', 'text/css');
		element.setAttribute('href', file);

		document.getElementsByTagName('head')[0].appendChild(element);

		this.css[file] = element;

		return element;
	},
	loadedJS: function (file) {
		if (this.js[file]) {
			return this.js[file];
		}

		return false;
	},
	loadedCSS: function (file) {
		if (this.css[file]) {
			return this.css[file];
		}

		return false;
	},
	die: function () {
		for (var i in this.js) {
			this.js[i].parentNode.removeChild(this.js[i]);
		}
		for (var i in this.css) {
			this.css[i].parentNode.removeChild(this.css[i]);
		}

		this.js = {};
		this.css = {};
		this.jQuery = false;
	}
};

window.bookmarklet.executeMyBookmarklet = function () {
    var options = {
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
        ready: function ($) {
            $("body").css("background","yellow");
            window.bookmarklet.die();
        }
    };
    window.bookmarklet.execute(options);
}

/*
window.bookmarklet.executeMyBookmarklet = function () {
    var options = {
        js: [
        	'http://svn.wikimedia.org/svnroot/mediawiki/trunk/tools/viaf/jquery.cookie.js',
			'http://svn.wikimedia.org/svnroot/mediawiki/trunk/tools/viaf/jquery.ba-replacetext.js',
        ],
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
        ready: function ($) {
			$("body").replaceText(/a/gi, "*****");
			console.log($.fn.replaceText);
			window.bookmarklet.die();
        }
    };

	window.bookmarklet.execute(options);
}
/*
window.bookmarklet.executeMyBookmarklet = function () {
	var options = {
		ready: function () {
			var links = document.getElementsByTagName('link');
			var num = links.length;

			if (!num) {
				return;
			}

			for (var n = 0; n < num; n++) {
				if (links[n].rel.toLowerCase() == 'stylesheet' && links[n].href) {
					if (links[n].href.indexOf('?') == -1) {
						links[n].href += '?';
					}

					links[n].href += '&r'
				}
			}

			window.bookmarklet.die();
		}
	};

	window.bookmarklet.execute(options);
}*/