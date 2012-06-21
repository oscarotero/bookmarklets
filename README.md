BOOKMARKLETS FRAMEWORK
======================

Created by Oscar Otero <http://oscarotero.com> <oom@oscarotero.com>
GNU Affero GPL version 3. http://www.gnu.org/licenses/agpl-3.0.html

Simple javascript framework focused to create bookmarklets easily. You can load css, jquery and other js files.
You only have to write a config file with the options for your bookmarklet. The available options are:

* jquery: If you want to use jQuery, define the url from load.
* css: The url to load some css code. If you need load more than one file, use an array.
* js: The url to load some javascript files. If you need load more than one file, use an array.
* ready: The function to be executed when the jQuery and all javascript files are loaded. If you use jQuery, the function has a parameter with the instance of the jQuery object (to prevent conflicts with the jQuery used by the webpage)

#### Example

	window.bookmarklet.options = {
		jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
		css: 'http://mysite.com/bookmarklet/styles.css',
		js: 'http://mysite.com/bookmarklet/javascript.js',

		ready: function ($bookmarklet_jquery_instance) {
			//Javascript code executed when jquery and js files are loaded.
		}
	}