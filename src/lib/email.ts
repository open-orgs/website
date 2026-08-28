import type { SignInput, ConsultationInput } from './validate';
import { AXES, AXIS_ORDER } from '../content/axes';

const SENDER_NAME = 'Open Orgs';

/** Every value in these emails is user-supplied, so nothing reaches the HTML part unescaped. */
function esc(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

interface Ctx {
	EMAIL: SendEmail;
	SENDER_EMAIL: string;
	ADMIN_EMAIL: string;
}

interface Mail {
	to: string;
	subject: string;
	text: string;
	html: string;
	replyTo?: string;
}

function send(env: Ctx, mail: Mail) {
	return env.EMAIL.send({
		to: mail.to,
		from: { email: env.SENDER_EMAIL, name: SENDER_NAME },
		replyTo: mail.replyTo,
		subject: mail.subject,
		text: mail.text,
		html: mail.html,
	});
}

/** Plain, quiet mail. The brand reads as a document first — that holds in the inbox too. */
function wrap(body: string): string {
	return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#282d33">${body}</div>`;
}

function rows(pairs: [string, string][]): { text: string; html: string } {
	const present = pairs.filter(([, v]) => v);
	return {
		text: present.map(([k, v]) => `${k}: ${v}`).join('\n'),
		html: present
			.map(([k, v]) => `<p style="margin:0 0 8px"><strong>${esc(k)}:</strong> ${esc(v)}</p>`)
			.join(''),
	};
}

const PRINCIPLES_TEXT = AXIS_ORDER.map((k) => `${String(AXES[k].n).padStart(2, '0')} ${AXES[k].label} — ${AXES[k].axis}`).join('\n');

const PRINCIPLES_HTML = AXIS_ORDER.map(
	(k) =>
		`<p style="margin:0 0 6px">${String(AXES[k].n).padStart(2, '0')} <strong>${esc(AXES[k].label)}</strong> — ${esc(AXES[k].axis)}</p>`
).join('');

/* ---------------------------------- sign ---------------------------------- */

export function sendSignAdminNotification(env: Ctx, input: SignInput, id: number) {
	const r = rows([
		['Organisation', input.organisationName],
		['Type', input.organisationType],
		['Contact', input.contactName],
		['Email', input.contactEmail],
		['Role', input.role || ''],
		['Record', `signatories #${id}`],
	]);
	return send(env, {
		to: env.ADMIN_EMAIL,
		replyTo: input.contactEmail,
		subject: `New signatory: ${input.organisationName}`,
		text: `A new organisation has signed the principles.\n\n${r.text}\n`,
		html: wrap(`<p style="margin:0 0 16px">A new organisation has signed the principles.</p>${r.html}`),
	});
}

export function sendSignConfirmation(env: Ctx, input: SignInput) {
	return send(env, {
		to: input.contactEmail,
		replyTo: env.ADMIN_EMAIL,
		subject: 'Open Orgs — your organisation has signed the principles',
		text:
			`${input.contactName},\n\n` +
			`${input.organisationName} is recorded as adopting the three principles.\n\n` +
			`${PRINCIPLES_TEXT}\n\n` +
			`The principles are in the public domain. There is no membership tier and no certification — ` +
			`what follows is the practice: publish the register, run the two-deep audit, list the interfaces.\n\n` +
			`Reply to this message if anything needs correcting.\n`,
		html: wrap(
			`<p style="margin:0 0 16px">${esc(input.contactName)},</p>` +
				`<p style="margin:0 0 16px"><strong>${esc(input.organisationName)}</strong> is recorded as adopting the three principles.</p>` +
				`<div style="margin:0 0 16px">${PRINCIPLES_HTML}</div>` +
				`<p style="margin:0 0 16px">The principles are in the public domain. There is no membership tier and no certification — what follows is the practice: publish the register, run the two-deep audit, list the interfaces.</p>` +
				`<p style="margin:0">Reply to this message if anything needs correcting.</p>`
		),
	});
}

/* ------------------------------ consultation ------------------------------ */

export function sendConsultationAdminNotification(env: Ctx, input: ConsultationInput) {
	const r = rows([
		['Organisation', input.organisationName],
		['Type', input.organisationType || ''],
		['Contact', input.contactName],
		['Email', input.contactEmail],
	]);
	const context = input.context
		? { text: `\nWhat is prompting this:\n${input.context}\n`, html: `<p style="margin:16px 0 4px"><strong>What is prompting this</strong></p><p style="margin:0;white-space:pre-wrap">${esc(input.context)}</p>` }
		: { text: '', html: '' };

	return send(env, {
		to: env.ADMIN_EMAIL,
		replyTo: input.contactEmail,
		subject: `Consultation request: ${input.organisationName}`,
		text: `A consultation call has been requested.\n\n${r.text}\n${context.text}`,
		html: wrap(`<p style="margin:0 0 16px">A consultation call has been requested.</p>${r.html}${context.html}`),
	});
}

export function sendConsultationConfirmation(env: Ctx, input: ConsultationInput) {
	return send(env, {
		to: input.contactEmail,
		replyTo: env.ADMIN_EMAIL,
		subject: 'Open Orgs — your consultation request',
		text:
			`${input.contactName},\n\n` +
			`Your request for a call about ${input.organisationName} has been received. ` +
			`We will follow up by email to find a time.\n\n` +
			`The call is about where the three principles would bind in your organisation and what would ` +
			`have to change. There is no cost and no engagement attached to it.\n\n` +
			`${PRINCIPLES_TEXT}\n`,
		html: wrap(
			`<p style="margin:0 0 16px">${esc(input.contactName)},</p>` +
				`<p style="margin:0 0 16px">Your request for a call about <strong>${esc(input.organisationName)}</strong> has been received. We will follow up by email to find a time.</p>` +
				`<p style="margin:0 0 16px">The call is about where the three principles would bind in your organisation and what would have to change. There is no cost and no engagement attached to it.</p>` +
				`<div style="margin:0">${PRINCIPLES_HTML}</div>`
		),
	});
}
