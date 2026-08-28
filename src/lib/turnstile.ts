const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SiteverifyResponse {
	success: boolean;
	action?: string;
	hostname?: string;
	'error-codes'?: string[];
}

/**
 * Server-side Turnstile verification. Fails closed: any network error, malformed response or
 * action mismatch is a rejection, never a pass. Tokens are single-use — the client resets the
 * widget before allowing a retry.
 */
export async function verifyTurnstile(
	token: string | undefined,
	secret: string,
	action: string,
	remoteip?: string
): Promise<boolean> {
	if (!token) return false;

	const body = new FormData();
	body.append('secret', secret);
	body.append('response', token);
	if (remoteip) body.append('remoteip', remoteip);

	try {
		const res = await fetch(SITEVERIFY, { method: 'POST', body });
		if (!res.ok) return false;
		const data = (await res.json()) as SiteverifyResponse;
		if (!data.success) return false;
		// The action is baked into the widget, so a token minted for the other form is a reject.
		if (data.action && data.action !== action) return false;
		return true;
	} catch {
		return false;
	}
}
