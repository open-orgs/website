import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { env } from 'cloudflare:workers';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import worker from '../src';
import { AXIS_ORDER, PRACTICE } from '../src/content/axes';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SentMail {
	to: string;
	from: { email: string; name: string };
	subject: string;
	text: string;
	html: string;
	replyTo?: string;
}

/**
 * Both outbound dependencies are stubbed rather than mocked at the module level: the email
 * binding has no local emulation, and Turnstile verification is an outbound fetch. Passing a
 * purpose-built env and swapping global fetch keeps the seams explicit.
 *
 * Only EMAIL is replaced. Every var comes from the pool config in vitest.config.mts, so tests
 * read the same values the Worker is handed and neither side can drift from the other.
 */
function testEnv(options: { failFromSend?: number } = {}) {
	// 1-based index of the first send that throws: 1 fails everything, 2 lets the admin
	// notification through and fails only the confirmation behind it.
	const failFrom = options.failFromSend ?? Infinity;
	const sent: SentMail[] = [];
	let attempts = 0;
	const patched = {
		...env,
		EMAIL: {
			send(mail: SentMail) {
				if (++attempts >= failFrom) throw new Error('E_DELIVERY_FAILED');
				sent.push(mail);
				return Promise.resolve({ messageId: `test-${sent.length}` });
			},
		},
	} as unknown as Env;
	return { env: patched, sent };
}

/**
 * Both routes log a failed send. Left alone, a passing run prints those stack traces to stderr,
 * which buries the output of a run that genuinely broke — so capture the log and assert on it
 * instead. Only the tests that expect an error use this; anything else still prints.
 */
function captureErrors() {
	const calls: unknown[][] = [];
	vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
		calls.push(args);
	});
	return calls;
}

let turnstilePasses = true;
let turnstileUnreachable = false;

beforeEach(() => {
	turnstilePasses = true;
	turnstileUnreachable = false;
	const real = globalThis.fetch;
	vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
		if (url.startsWith(SITEVERIFY)) {
			if (turnstileUnreachable) return Promise.reject(new Error('E_NETWORK'));
			return Promise.resolve(Response.json({ success: turnstilePasses, action: turnstilePasses ? undefined : 'sign' }));
		}
		return real(input as RequestInfo, init);
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

async function post(path: string, body: unknown, e: Env) {
	const request = new Request(`https://openorgs.org${path}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	});
	const ctx = createExecutionContext();
	const response = await worker.fetch(request, e, ctx);
	await waitOnExecutionContext(ctx);
	return { response, body: (await response.json()) as Record<string, any> };
}

const VALID_SIGN = {
	organizationName: 'Acme Co',
	organizationType: 'SME',
	contactName: 'A Person',
	contactEmail: 'person@acme.test',
	role: 'CTO',
	ack: true,
	'cf-turnstile-response': 'token',
};

const VALID_CONSULT = {
	organizationName: 'Acme Co',
	contactName: 'A Person',
	contactEmail: 'person@acme.test',
	organizationType: 'SME',
	context: 'Our decision routing is a bottleneck.',
	'cf-turnstile-response': 'token',
};

// vitest.config.mts pins these bindings so a run cannot pick up whatever happens to be in
// .dev.vars. If that override ever stopped winning, every other test here would still pass while
// quietly exercising real values — so assert it outright.
describe('test environment', () => {
	it('runs against fixed test bindings, not .dev.vars', () => {
		expect(env.ADMIN_EMAIL).toBe('admin@openorgs.test');
		expect(env.SENDER_EMAIL).toBe('hello@openorgs.test');
		expect(env.TURNSTILE_SECRET_KEY).toBe('1x0000000000000000000000000000000AA');
	});
});

describe('GET /', () => {
	it('serves the homepage with a doctype', async () => {
		const ctx = createExecutionContext();
		const response = await worker.fetch(new Request('https://openorgs.org/'), env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('text/html');
		// Without a doctype the browser falls into quirks mode and the layout breaks.
		expect(await response.text()).toMatch(/^<!doctype html>/i);
	});

	it('names the three principles in the fixed order', async () => {
		const ctx = createExecutionContext();
		const html = await (await worker.fetch(new Request('https://openorgs.org/'), env, ctx)).text();
		await waitOnExecutionContext(ctx);

		const order = html.match(/All Affected|No One Is Indispensable|Open Systems/g) ?? [];
		expect(order.slice(0, 3)).toEqual(['All Affected', 'No One Is Indispensable', 'Open Systems']);
	});

	it('renders every practice with both a do and a dont', async () => {
		const ctx = createExecutionContext();
		const html = await (await worker.fetch(new Request('https://openorgs.org/'), env, ctx)).text();
		await waitOnExecutionContext(ctx);

		const titles = AXIS_ORDER.flatMap((k) => PRACTICE[k].map((p) => p.title));
		for (const title of titles) expect(html).toContain(title);

		// Group sizes may differ by axis, but a principle that thins below three practices has
		// stopped being auditable, which is the whole claim the section makes.
		for (const axis of AXIS_ORDER) expect(PRACTICE[axis].length).toBeGreaterThanOrEqual(3);

		// A practice without its don't is a slogan: the don't is what makes adoption testable.
		expect(html.match(/oo-practice__rule--do\b/g)).toHaveLength(titles.length);
		expect(html.match(/oo-practice__rule--dont\b/g)).toHaveLength(titles.length);
	});

	// AGENTS.md bans the em dash in every user-facing string, and Practice alone is ~1,800 words
	// of copy. Guard the rule rather than relying on review catching one.
	it('contains no em dash in the rendered page', async () => {
		const ctx = createExecutionContext();
		const html = await (await worker.fetch(new Request('https://openorgs.org/'), env, ctx)).text();
		await waitOnExecutionContext(ctx);

		expect(html).not.toContain('—');
	});

	// The prototype's fabricated stat, invented testimonial and imaginary review process must
	// never come back. A number without a source line does not ship.
	it.each(['41%', 'Chair, works council', 'reviewed by two existing signatories'])(
		'does not contain the fabricated copy %s',
		async (banned) => {
			const ctx = createExecutionContext();
			const html = await (await worker.fetch(new Request('https://openorgs.org/'), env, ctx)).text();
			await waitOnExecutionContext(ctx);
			expect(html).not.toContain(banned);
		},
	);
});

describe('POST /api/sign', () => {
	it('stores the signatory and sends both emails', async () => {
		const t = testEnv();
		const { response, body } = await post('/api/sign', VALID_SIGN, t.env);

		expect(response.status).toBe(200);
		expect(body).toEqual({ ok: true });

		const row = await env.DB.prepare(
			'SELECT organization_name, organization_type, contact_email, role, status FROM signatories WHERE contact_email = ?',
		)
			.bind('person@acme.test')
			.first();
		expect(row).toMatchObject({
			organization_name: 'Acme Co',
			organization_type: 'SME',
			role: 'CTO',
			status: 'pending',
		});

		expect(t.sent.map((m) => m.to)).toEqual([env.ADMIN_EMAIL, 'person@acme.test']);
		expect(t.sent[0].from.email).toBe(env.SENDER_EMAIL);
		expect(t.sent[0].subject).toContain('Acme Co');
	});

	it('rejects a missing contact email with a field error', async () => {
		const t = testEnv();
		const { organizationName, organizationType, contactName, ack } = VALID_SIGN;
		const { response, body } = await post(
			'/api/sign',
			{ organizationName, organizationType, contactName, ack, 'cf-turnstile-response': 'token' },
			t.env,
		);

		expect(response.status).toBe(400);
		expect(body.errors.contactEmail).toBeTruthy();
		expect(t.sent).toHaveLength(0);
	});

	it('rejects an unchecked acknowledgment — partial adoption is not listed', async () => {
		const t = testEnv();
		const { response, body } = await post('/api/sign', { ...VALID_SIGN, ack: false }, t.env);

		expect(response.status).toBe(400);
		expect(body.errors.ack).toContain('Partial adoption is not listed');
	});

	it('stores nothing when Turnstile rejects the submission', async () => {
		turnstilePasses = false;
		const t = testEnv();

		const { response } = await post('/api/sign', { ...VALID_SIGN, contactEmail: 'bot@acme.test' }, t.env);

		expect(response.status).toBe(403);
		const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM signatories').first<{ n: number }>();
		expect(count!.n).toBe(0);
		expect(t.sent).toHaveLength(0);
	});

	// verifyTurnstile catches its own errors, so an unreachable siteverify must not read as a
	// pass. This is the one branch where a silent regression would let every bot through.
	it('fails closed when Turnstile cannot be reached', async () => {
		turnstileUnreachable = true;
		const t = testEnv();

		const { response } = await post('/api/sign', VALID_SIGN, t.env);

		expect(response.status).toBe(403);
		const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM signatories').first<{ n: number }>();
		expect(count!.n).toBe(0);
	});

	// The row is the source of truth; a transient mail failure must not lose a signature.
	it('still succeeds when email delivery fails', async () => {
		const t = testEnv({ failFromSend: 1 });
		const errors = captureErrors();
		const { response } = await post('/api/sign', { ...VALID_SIGN, contactEmail: 'resilient@acme.test' }, t.env);

		expect(response.status).toBe(200);
		// Swallowed, but never silent — the admin has to be able to find the signature by hand.
		expect(errors).toHaveLength(1);
		expect(errors[0][0]).toBe('sign: email failed');
		const row = await env.DB.prepare('SELECT id FROM signatories WHERE contact_email = ?').bind('resilient@acme.test').first();
		expect(row).not.toBeNull();
	});
});

describe('POST /api/consultation', () => {
	it('emails the admin and the requester, and stores nothing', async () => {
		const t = testEnv();
		const { response, body } = await post('/api/consultation', VALID_CONSULT, t.env);

		expect(response.status).toBe(200);
		expect(body).toEqual({ ok: true });

		expect(t.sent.map((m) => m.to)).toEqual([env.ADMIN_EMAIL, 'person@acme.test']);
		expect(t.sent[0].replyTo).toBe('person@acme.test');
		expect(t.sent[0].text).toContain('Our decision routing is a bottleneck.');

		const tables = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE '%consultation%'").all();
		expect(tables.results).toHaveLength(0);
	});

	it('rejects a missing organization with a field error', async () => {
		const t = testEnv();
		const { response, body } = await post('/api/consultation', { ...VALID_CONSULT, organizationName: '' }, t.env);

		expect(response.status).toBe(400);
		expect(body.errors.organizationName).toBeTruthy();
		expect(t.sent).toHaveLength(0);
	});

	it('sends nothing when Turnstile rejects the submission', async () => {
		turnstilePasses = false;
		const t = testEnv();
		const { response } = await post('/api/consultation', VALID_CONSULT, t.env);

		expect(response.status).toBe(403);
		expect(t.sent).toHaveLength(0);
	});

	// The request is already in the admin inbox by then, so a failed confirmation is a courtesy
	// lost, not a request lost — the caller must not be told to retry and send a duplicate.
	it('still succeeds when only the requester confirmation fails', async () => {
		const t = testEnv({ failFromSend: 2 });
		const errors = captureErrors();
		const { response, body } = await post('/api/consultation', VALID_CONSULT, t.env);

		expect(response.status).toBe(200);
		expect(body).toEqual({ ok: true });
		expect(t.sent.map((m) => m.to)).toEqual([env.ADMIN_EMAIL]);
		expect(errors).toHaveLength(1);
		expect(errors[0][0]).toBe('consultation: confirmation failed');
	});

	// Nothing is stored, so the admin notification IS the record. Losing it must be visible.
	it('fails loudly when the admin notification cannot be delivered', async () => {
		const t = testEnv({ failFromSend: 1 });
		const errors = captureErrors();
		const { response, body } = await post('/api/consultation', VALID_CONSULT, t.env);

		expect(response.status).toBe(500);
		expect(body.message).toBeTruthy();
		expect(errors).toHaveLength(1);
		expect(errors[0][0]).toBe('consultation: admin notification failed');
	});
});
