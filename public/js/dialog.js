/**
 * The two form dialogs. Native <dialog> gives focus trapping, Esc-to-close and top-layer
 * stacking, so this only has to open them and run the submit lifecycle.
 *
 * Submission goes through fetch rather than a native POST so the page never reloads and the
 * toast survives to be read.
 */
(function () {
	'use strict';

	var ENDPOINT = {
		sign: '/api/sign',
		consultation: '/api/consultation',
	};

	var SUCCESS = {
		sign: "Organization submitted. We'll follow up by email.",
		consultation: "Request received. We'll follow up by email to schedule a call.",
	};

	function clearErrors(form) {
		var slots = form.querySelectorAll('[data-oo-error-for]');
		for (var i = 0; i < slots.length; i++) {
			slots[i].textContent = '';
			slots[i].hidden = true;
			var control = form.querySelector('#' + CSS.escape(slots[i].getAttribute('data-oo-error-for')));
			if (control) control.removeAttribute('aria-invalid');
		}
		var status = form.querySelector('[data-oo-status]');
		if (status) {
			status.textContent = '';
			status.hidden = true;
		}
	}

	function showErrors(form, errors) {
		var first = null;
		for (var field in errors) {
			if (!Object.prototype.hasOwnProperty.call(errors, field)) continue;
			var control = form.querySelector('[name="' + field + '"]');
			if (!control || !control.id) continue;
			var slot = form.querySelector('[data-oo-error-for="' + control.id + '"]');
			if (slot) {
				slot.textContent = errors[field];
				slot.hidden = false;
			}
			control.setAttribute('aria-invalid', 'true');
			if (!first) first = control;
		}
		if (first && first.focus) first.focus();
		return !!first;
	}

	function showStatus(form, message) {
		var status = form.querySelector('[data-oo-status]');
		if (!status) return;
		status.textContent = message;
		status.hidden = false;
	}

	// Turnstile tokens are single-use. A same-page retry has to start from a fresh one.
	function resetTurnstile(form) {
		var widget = form.querySelector('.cf-turnstile');
		if (widget && window.turnstile && window.turnstile.reset) {
			try {
				window.turnstile.reset(widget);
			} catch (e) {
				/* the widget may not have rendered yet — nothing to reset */
			}
		}
	}

	function submit(form, name) {
		var button = form.querySelector('[data-oo-submit]');
		var payload = {};
		var data = new FormData(form);
		data.forEach(function (value, key) {
			payload[key] = value;
		});
		// An unchecked box is absent from FormData; the server needs to see the difference.
		var ack = form.querySelector('[name="ack"]');
		if (ack) payload.ack = ack.checked;

		clearErrors(form);
		if (button) button.disabled = true;

		fetch(ENDPOINT[name], {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload),
		})
			.then(function (res) {
				return res.json().then(
					function (body) {
						return { status: res.status, body: body };
					},
					function () {
						return { status: res.status, body: {} };
					},
				);
			})
			.then(function (r) {
				if (r.status === 200) {
					var dialog = document.getElementById('dialog-' + name);
					if (dialog) dialog.close();
					form.reset();
					resetTurnstile(form);
					if (window.ooToast) window.ooToast(SUCCESS[name]);
					return;
				}

				resetTurnstile(form);

				if (r.status === 400 && r.body.errors && showErrors(form, r.body.errors)) return;
				showStatus(form, r.body.message || 'That did not go through. Try again.');
			})
			.catch(function () {
				resetTurnstile(form);
				showStatus(form, 'The request could not be sent. Check your connection and try again.');
			})
			.then(function () {
				if (button) button.disabled = false;
			});
	}

	function init() {
		var openers = document.querySelectorAll('[data-oo-open]');
		for (var i = 0; i < openers.length; i++) {
			openers[i].addEventListener('click', function (e) {
				var name = e.currentTarget.getAttribute('data-oo-open');
				var dialog = document.getElementById('dialog-' + name);
				if (!dialog || !dialog.showModal) return;
				// Errors from an abandoned attempt should not greet the next one.
				var form = dialog.querySelector('[data-oo-form]');
				if (form) clearErrors(form);
				dialog.showModal();
			});
		}

		var forms = document.querySelectorAll('[data-oo-form]');
		for (var j = 0; j < forms.length; j++) {
			var form = forms[j];
			var name = form.getAttribute('data-oo-form');

			form.addEventListener(
				'submit',
				(function (f, n) {
					return function (e) {
						e.preventDefault();
						submit(f, n);
					};
				})(form, name),
			);

			var closers = form.querySelectorAll('[data-oo-close]');
			for (var k = 0; k < closers.length; k++) {
				closers[k].addEventListener(
					'click',
					(function (n) {
						return function () {
							var dialog = document.getElementById('dialog-' + n);
							if (dialog) dialog.close();
						};
					})(name),
				);
			}
		}
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
