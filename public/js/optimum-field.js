/**
 * The optimum field. Ported from the design system's OptimumField component — the logic was
 * already plain DOM work, so it lifts out of React unchanged.
 *
 * Three behaviours are load-bearing and were each learned by breaking them:
 *   1. The viewBox tracks the container's own pixel box, with all geometry as fractions of it,
 *      so scale is 1:1 and nothing is cropped. Re-measured on resize and via ResizeObserver,
 *      because a hero's aspect changes with layout, not only with window size.
 *   2. Each crossing is hit-tested against the live text boxes and dropped if it would sit
 *      behind a glyph. Those boxes are cached as offsets from the SVG's own rect — viewport
 *      coordinates go stale on scroll.
 *   3. One clock: a wall-clock setInterval at 10fps driving a 40-second drift. Never add
 *      requestAnimationFrame alongside it, and never construct an IntersectionObserver
 *      (it throws in some embedded frames, killing the script).
 *
 * Fewer dots appear than there are line pairs. That is correct — legibility outranks completeness.
 */
(function () {
	'use strict';

	var SAMPLES = 64;
	var FPS = 10;
	var CYCLE = 40000;
	var AVOID = 'h1,h2,h3,h4,p,span,li,a,button';

	// Geometry is expressed as FRACTIONS of the container, never in a fixed design box.
	var VARY = {
		desc: [
			{ y0: 0.122, y3: 0.948, h1: 0.86, h2: 0.96, amp: 0.035, rate: 1.0 },
			{ y0: 0.209, y3: 0.891, h1: 0.04, h2: 0.14, amp: 0.026, rate: 1.52 },
		],
		asc: [
			{ y0: 0.957, y3: 0.152, h1: 0.88, h2: 0.97, amp: 0.03, rate: 1.26 },
			{ y0: 0.878, y3: 0.226, h1: 0.05, h2: 0.16, amp: 0.022, rate: 0.74 },
		],
	};
	var XS = [-0.055, 0.266, 0.641, 1.055];

	function bez(p, t) {
		var m = 1 - t;
		return {
			x: m * m * m * p[0][0] + 3 * m * m * t * p[1][0] + 3 * m * t * t * p[2][0] + t * t * t * p[3][0],
			y: m * m * m * p[0][1] + 3 * m * m * t * p[1][1] + 3 * m * t * t * p[2][1] + t * t * t * p[3][1],
		};
	}

	function ctrl(dir, i, phase, w, h) {
		var v = (dir < 0 ? VARY.desc : VARY.asc)[i % 2];
		var y0 = (v.y0 + v.amp * Math.sin(phase * v.rate + i * 1.7)) * h;
		var y3 = (v.y3 + v.amp * Math.sin(phase * v.rate * 0.8 + i * 2.3)) * h;
		var d = y3 - y0;
		return [
			[XS[0] * w, y0],
			[XS[1] * w, y0 + d * v.h1],
			[XS[2] * w, y0 + d * v.h2],
			[XS[3] * w, y3],
		];
	}

	function table(p) {
		var a = [];
		for (var i = 0; i <= SAMPLES; i++) a.push(bez(p, i / SAMPLES));
		return a;
	}

	function yAt(tb, x) {
		var lo = 0;
		var hi = tb.length - 1;
		if (x <= tb[0].x) return tb[0].y;
		if (x >= tb[hi].x) return tb[hi].y;
		while (hi - lo > 1) {
			var m = (lo + hi) >> 1;
			if (tb[m].x <= x) lo = m;
			else hi = m;
		}
		var a = tb[lo];
		var b = tb[hi];
		return a.y + ((x - a.x) / (b.x - a.x || 1)) * (b.y - a.y);
	}

	// The crossing is SOLVED, never placed: bisect the root of curve A − curve B.
	function cross(A, B, w) {
		var lo = 0;
		var hi = w;
		var fl = yAt(A, lo) - yAt(B, lo);
		var fh = yAt(A, hi) - yAt(B, hi);
		if (fl === 0) return { x: lo, y: yAt(A, lo) };
		if (fl * fh > 0) return null;
		for (var k = 0; k < 28; k++) {
			var mid = (lo + hi) / 2;
			var fm = yAt(A, mid) - yAt(B, mid);
			if (fl * fm <= 0) {
				hi = mid;
			} else {
				lo = mid;
				fl = fm;
			}
		}
		var m = (lo + hi) / 2;
		return { x: m, y: yAt(A, m) };
	}

	function pathD(p) {
		return (
			'M' +
			p[0][0].toFixed(1) +
			' ' +
			p[0][1].toFixed(1) +
			' C' +
			p[1][0].toFixed(1) +
			' ' +
			p[1][1].toFixed(1) +
			' ' +
			p[2][0].toFixed(1) +
			' ' +
			p[2][1].toFixed(1) +
			' ' +
			p[3][0].toFixed(1) +
			' ' +
			p[3][1].toFixed(1)
		);
	}

	function mount(svg) {
		var desc = [svg.querySelector('[data-oo-desc="0"]'), svg.querySelector('[data-oo-desc="1"]')];
		var asc = [svg.querySelector('[data-oo-asc="0"]'), svg.querySelector('[data-oo-asc="1"]')];
		var dots = [];
		for (var d = 0; d < 4; d++) dots.push(svg.querySelector('[data-oo-dot="' + d + '"]'));

		var boxes = null;
		var size = { w: 0, h: 0 };

		// Text boxes are cached as offsets from the SVG's own rect. Viewport coordinates go stale
		// the moment the page scrolls, because field and copy scroll together.
		function measureText() {
			var r = svg.getBoundingClientRect();
			var host = svg.parentNode;
			var els = host ? Array.prototype.slice.call(host.querySelectorAll(AVOID)) : [];
			boxes = [];
			for (var i = 0; i < els.length; i++) {
				if (svg.contains(els[i])) continue;
				var b = els[i].getBoundingClientRect();
				if (b.width > 4 && b.height > 4) {
					boxes.push({ l: b.left - r.left, t: b.top - r.top, rt: b.right - r.left, bt: b.bottom - r.top });
				}
			}
		}

		// The viewBox tracks the container's own pixel box, so scale is always 1:1 — nothing is
		// ever cropped, and the whole field is always the visible field.
		function measureBox() {
			var r = svg.getBoundingClientRect();
			var w = Math.max(1, Math.round(r.width));
			var h = Math.max(1, Math.round(r.height));
			if (w !== size.w || h !== size.h) {
				size = { w: w, h: h };
				svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
			}
			return size;
		}

		function draw(phase) {
			var box = measureBox();
			var w = box.w;
			var h = box.h;
			if (!boxes) measureText();

			var dT = [];
			var aT = [];
			var i, j;
			for (i = 0; i < 2; i++) {
				var pd = ctrl(-1, i, phase, w, h);
				if (desc[i]) desc[i].setAttribute('d', pathD(pd));
				dT.push(table(pd));
			}
			for (j = 0; j < 2; j++) {
				var pa = ctrl(1, j, phase, w, h);
				if (asc[j]) asc[j].setAttribute('d', pathD(pa));
				aT.push(table(pa));
			}

			var n = 0;
			for (i = 0; i < 2; i++) {
				for (j = 0; j < 2; j++) {
					var c = cross(dT[i], aT[j], w);
					var dot = dots[n++];
					if (!dot) continue;
					var show = false;
					if (c && c.x > 10 && c.x < w - 10 && c.y > 8 && c.y < h - 8) {
						var PAD = 7;
						show = true;
						for (var k = 0; k < boxes.length; k++) {
							var b = boxes[k];
							if (c.x > b.l - PAD && c.x < b.rt + PAD && c.y > b.t - PAD && c.y < b.bt + PAD) {
								show = false;
								break;
							}
						}
					}
					if (show) {
						dot.setAttribute('cx', c.x.toFixed(1));
						dot.setAttribute('cy', c.y.toFixed(1));
						dot.setAttribute('opacity', '1');
					} else {
						dot.setAttribute('opacity', '0');
					}
				}
			}
		}

		var phase = 0;
		draw(0);

		function invalidate() {
			boxes = null;
			draw(phase);
		}

		window.addEventListener('resize', invalidate);
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(invalidate);
		// Two settles: one for webfont swap, and one after the hero's reveal animation has
		// finished. getBoundingClientRect returns the transformed box, so text measured mid-reveal
		// is 12px out and the crossings hide against the wrong rectangles.
		setTimeout(invalidate, 600);
		setTimeout(invalidate, 1600);

		try {
			if (window.ResizeObserver) new ResizeObserver(invalidate).observe(svg);
		} catch (e) {
			/* not fatal */
		}

		var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) return;

		// One wall-clock interval. A 40s drift needs nothing faster, and driving it from both
		// setInterval and rAF doubles the work and locks the main thread.
		var t0 = Date.now();
		setInterval(function () {
			if (document.hidden) return;
			phase = ((Date.now() - t0) / CYCLE) * Math.PI * 2;
			draw(phase);
		}, 1000 / FPS);
	}

	function init() {
		var fields = document.querySelectorAll('[data-oo-field]');
		for (var i = 0; i < fields.length; i++) mount(fields[i]);
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
