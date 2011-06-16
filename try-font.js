window.bookmarklet.options = {
	jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js',
	css: 'try-font.css',
	js: 'try-font.list.js',

	ready: function ($) {
		var $selected = $(), $widget, $menu_font, $menu_variant,
		fonts = window.bookmarklet.options.fonts,
		helpers = {
			hoverIn: function (e) {
				$(e.target).addClass('try-font-hover').parents().removeClass('try-font-hover');
			},
			hoverOut: function (e) {
				$(e.target).removeClass('try-font-hover');
			},
			hoverClick: function (e) {
				$selected = $(e.target);

				if ($selected.hasClass('try-font-selected')) {
					$selected.removeClass('try-font-selected');
					$menu_font.val('-1').change();
					$selected = false;

					return false;
				}

				$('.try-font-selected').removeClass('try-font-selected');
				$selected = $(e.target).addClass('try-font-selected');

				if ($selected.data('try-font-key') != undefined) {
					$menu_font.val($selected.data('try-font-key')).change();
					$menu_variant.val($selected.data('try-font-variant'));
				} else {
					$menu_font.val('-1').change();
				}
			},
			fillVariants: function (keyfont) {
				$menu_variant.empty();

				if (!keyfont || !fonts[keyfont]) {
					return;
				}

				$.each(fonts[keyfont].variants, function (name, info) {
					$('<option></option>', {
						html: name,
						value: name
					}).appendTo($menu_variant);
				});
			}
		};
		
		$widget ='<div id="try-font">'
			+ '<label>Family: <select id="try-font-family">'
			+ '<option value="-1"></option>'
			+ '</select></label>'
			+ '<label>Variant: <select id="try-font-variant">'
			+ '</select></label>'
			+ '<button id="try-font-close">Close</button>'
			+ '</div>';

		$('body').children().hover(helpers.hoverIn, helpers.hoverOut).click(helpers.hoverClick);

		$widget = $($widget).appendTo('body');
		$menu_font = $widget.find('#try-font-family');
		$menu_variant = $widget.find('#try-font-variant');

		//Close button
		$widget.find('#try-font-close').click(function () {
			$('body').children()
				.unbind('mouseenter', helpers.hoverIn)
				.unbind('mouseleave', helpers.hoverOut)
				.unbind('click', helpers.hoverClick);
			
			$widget.remove();

			$('.try-font-hover, .try-font-selected').removeClass('try-font-hover try-font-selected');

			window.bookmarklet.die();
		});

		//Save font list
		$.each(fonts, function (k, info) {
			$('<option></option>', {
				html: info.name,
				value: k
			}).appendTo($menu_font);
		});

		//Apply the font
		$menu_font.change(function () {
			var value = $(this).val();
			var font = fonts[value];

			if (value == -1) {
				$selected.css('font-family', '').removeData('try-font-key');
			}

			if (!$selected.length || !font) {
				helpers.fillVariants();
				$(this).val('-1');
				return false;
			}

			helpers.fillVariants(value);

			window.bookmarklet.loadCSS(font.file);

			$selected.css('font-family', font.name).data('try-font-key', value);

			//Select the first variant
			for(var variant in font.variants) {
				$menu_variant.val(variant).change();
				break;
			}
		});

		//Apply the variant
		$menu_variant.change(function () {
			var value = $(this).val();
			var font = fonts[$selected.data('try-font-key')];

			if (!$selected.length || !font || !font.variants[value]) {
				return false;
			}

			$selected.css({
				'font-weight': font.variants[value][0],
				'font-style': font.variants[value][1]
			}).data('try-font-variant', value);
		});
	}
};