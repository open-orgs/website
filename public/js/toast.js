/** Transient confirmation. One toast on screen at a time; the region is rendered by the server. */
(function () {
	'use strict';

	var HOLD = 6000;
	var timer = null;

	window.ooToast = function (message) {
		var el = document.querySelector('[data-oo-toast]');
		if (!el) return;
		el.textContent = message;
		el.hidden = false;
		if (timer) clearTimeout(timer);
		timer = setTimeout(function () {
			el.hidden = true;
		}, HOLD);
	};
})();
