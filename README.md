Bookmarklet Framework
=====================

Created by Oscar Otero <http://oscarotero.com> <oom@oscarotero.com>
GNU Affero GPL version 3. http://www.gnu.org/licenses/agpl-3.0.html

Simple javascript framework focused to create bookmarklets easily. You can load css, jquery and other js files.
You only have to write a config file with the options for your bookmarklet. The available options are:

* jquery: If you want to use jQuery, define the url where load it.
* css: The url to load some css code. If you need load more than one file, use an array.
* js: The url to load some javascript files. If you need load more than one file, use an array.
* ready: The function to be executed when the jQuery and all javascript files are loaded. If you use jQuery, the function has a parameter with the instance of the jQuery object (to prevent conflicts with the jQuery used by the webpage)

#### Example

```javascript
window.bookmarklet.options = {
	jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
	css: 'http://mysite.com/bookmarklet/styles.css',
	js: 'http://mysite.com/bookmarklet/javascript.js',

	ready: function ($bookmarklet_jquery_instance) {
		//Javascript code executed when jquery and js files are loaded.
	}
}
```

#### Loading the options in an external file

This method is useful if you have several bookmarklets and prefer keep the bookmarklet framework in an individual file.

You have to create a javascript file with the options, for example, this bookmarklet removes all images of the current page:

```javascript
window.bookmarklet.options = {
	jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',

	ready: function ($) {
		$('img').remove();
	}
}
```

To execute this bookmarklet, you have to load the framework and execute the function lauch passing the url of the options file:

```javascript
window.bookmarklet.launch('http://mysite.com/bookmarklet-options.js');
```

To convert this code in a real bookmarklet you need some extra code (obviously, this code can be shorter and minified):

```javascript
var launchBookmarklet = function () {
	var b = 'http://mysite.com/bookmarklet.js';
	var f = 'http://mysite.com/bookmarklet-options.js';

	if (window.bookmarklet == undefined || window.bookmarklet.launch == undefined) {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = b;

		if (!document.attachEvent) {
			s.onload = function () {
				window.bookmarklet.launch(f);
			}
		} else {
			s.onreadystatechange = function () {
				if (s.readyState == 'complete' || s.readyState == 'loaded') {
					window.bookmarklet.launch(f);
					s.onreadystatechange = null;
				}
			}
		}

		document.body.appendChild(s);
	} else {
		window.bookmarklet.launch(f);
	}
};
```
```html
<a href="javascript:launchBookmarklet();">Remove all images</a>
```

#### Loading all code in an unique file

You can include the options in the same file than the bookmarklet to reduce http requests. Append the following code in bookmarklet.js:

```javascript
var executeMyBookmarklet = function () {
	window.bookmarklet.execute({
		jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',

		ready: function ($) {
			$('img').remove();
		}
	});
}
```

And now you have to create the bookmarklet code:

```javascript
var launchBookmarklet = function () {
	var b = 'http://mysite.com/bookmarklet.js';

	if (window.bookmarklet == undefined || window.bookmarklet.executeMyBookmarklet == undefined) {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = b;

		if (!document.attachEvent) {
			s.onload = function () {
				window.bookmarklet.executeMyBookmarklet();
			}
		} else {
			s.onreadystatechange = function () {
				if (s.readyState == 'complete' || s.readyState == 'loaded') {
					window.bookmarklet.executeMyBookmarklet();
					s.onreadystatechange = null;
				}
			}
		}

		document.body.appendChild(s);
	} else {
		window.bookmarklet.executeMyBookmarklet();
	}
};
```
```html
<a href="javascript:launchBookmarklet();">Remove all images</a>
```