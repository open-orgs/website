import { z } from 'zod';
import { ORGANISATION_TYPES } from '../content/axes';

/**
 * Messages are what the user reads, so they explain the constraint rather than the control —
 * "Partial adoption is not listed", not "This field is required". The same message covers a
 * missing field and an empty one; the distinction is not the reader's problem.
 */
const required = (max: number, message: string) =>
	z.string({ error: message }).trim().min(1, message).max(max, 'That is longer than this field accepts.');

const optional = (max: number) => z.string().trim().max(max, 'That is longer than this field accepts.').optional().or(z.literal(''));

const email = (message: string) => required(200, message).pipe(z.email('That email address is not valid.'));

export const signSchema = z.object({
	organisationName: required(200, 'Name the organisation adopting the principles.'),
	organisationType: z.enum(ORGANISATION_TYPES, 'Choose the closest organisation type.'),
	contactName: required(120, 'Give a name we can address a reply to.'),
	contactEmail: email('Give an email address we can reply to.'),
	role: optional(120),
	ack: z.literal(true, 'All three principles, or none. Partial adoption is not listed.'),
});

export const consultationSchema = z.object({
	organisationName: required(200, 'Name the organisation the call is about.'),
	contactName: required(120, 'Give a name we can address a reply to.'),
	contactEmail: email('Give an email address we can reply to.'),
	organisationType: z.enum(ORGANISATION_TYPES).optional().or(z.literal('')),
	context: optional(4000),
});

export type SignInput = z.infer<typeof signSchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;

/** Flatten a zod failure to one message per field — that is all the client renders. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
	const out: Record<string, string> = {};
	for (const issue of error.issues) {
		const key = String(issue.path[0] ?? '');
		if (key && !out[key]) out[key] = issue.message;
	}
	return out;
}
