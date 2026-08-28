import { Hono } from 'hono';
import { signSchema, fieldErrors } from '../lib/validate';
import { verifyTurnstile } from '../lib/turnstile';
import { insertSignatory } from '../lib/db';
import { sendSignAdminNotification, sendSignConfirmation } from '../lib/email';

export const sign = new Hono<{ Bindings: Env }>();

sign.post('/api/sign', async (c) => {
	const body = await c.req.json().catch(() => null);
	if (body === null || typeof body !== 'object') {
		return c.json({ message: 'That did not go through. Try again.' }, 400);
	}

	const parsed = signSchema.safeParse(body);
	if (!parsed.success) {
		return c.json({ errors: fieldErrors(parsed.error) }, 400);
	}

	const token = (body as Record<string, unknown>)['cf-turnstile-response'];
	const ok = await verifyTurnstile(
		typeof token === 'string' ? token : undefined,
		c.env.TURNSTILE_SECRET_KEY,
		'sign',
		c.req.header('cf-connecting-ip'),
	);
	if (!ok) {
		return c.json({ message: 'That could not be verified as a human submission. Try again.' }, 403);
	}

	const id = await insertSignatory(c.env.DB, parsed.data);

	// The row is the source of truth. A mail that fails to send is logged, not surfaced —
	// losing the signature to a transient SMTP problem would be the worse outcome.
	try {
		await Promise.all([sendSignAdminNotification(c.env, parsed.data, id), sendSignConfirmation(c.env, parsed.data)]);
	} catch (error) {
		console.error('sign: email failed', { id, error });
	}

	return c.json({ ok: true });
});
