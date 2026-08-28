import { Hono } from 'hono';
import { raw } from 'hono/html';
import { HomePage } from '../pages/HomePage';

export const pages = new Hono<{ Bindings: Env }>();

// c.html() does not emit a doctype of its own, and without one the browser falls into quirks
// mode — which breaks the layout outright. It has to be prepended here.
const DOCTYPE = raw('<!doctype html>');

pages.get('/', (c) =>
	c.html(
		<>
			{DOCTYPE}
			<HomePage turnstileSiteKey={c.env.TURNSTILE_SITE_KEY} />
		</>
	)
);
