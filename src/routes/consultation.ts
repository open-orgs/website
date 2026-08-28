import { Hono } from 'hono';
import { consultationSchema, fieldErrors } from '../lib/validate';
import { verifyTurnstile } from '../lib/turnstile';
import { sendConsultationAdminNotification, sendConsultationConfirmation } from '../lib/email';

export const consultation = new Hono<{ Bindings: Env }>();

consultation.post('/api/consultation', async (c) => {
	const body = await c.req.json().catch(() => null);
	if (body === null || typeof body !== 'object') {
		return c.json({ message: 'That did not go through. Try again.' }, 400);
	}

	const parsed = consultationSchema.safeParse(body);
	if (!parsed.success) {
		return c.json({ errors: fieldErrors(parsed.error) }, 400);
	}

	const token = (body as Record<string, unknown>)['cf-turnstile-response'];
	const ok = await verifyTurnstile(
		typeof token === 'string' ? token : undefined,
		c.env.TURNSTILE_SECRET_KEY,
		'consultation',
		c.req.header('cf-connecting-ip')
	);
	if (!ok) {
		return c.json({ message: 'That could not be verified as a human submission. Try again.' }, 403);
	}

	// Nothing is stored for a consultation request, so the admin notification IS the record.
	// If it does not send, the request is lost — say so and let the caller retry.
	try {
		await sendConsultationAdminNotification(c.env, parsed.data);
	} catch (error) {
		console.error('consultation: admin notification failed', error);
		return c.json({ message: 'The request could not be delivered. Try again in a moment.' }, 500);
	}

	// The confirmation is a courtesy — the request is already safely in the inbox.
	try {
		await sendConsultationConfirmation(c.env, parsed.data);
	} catch (error) {
		console.error('consultation: confirmation failed', error);
	}

	return c.json({ ok: true });
});
