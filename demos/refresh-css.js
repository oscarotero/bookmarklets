window.bookmarklet.options = {
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