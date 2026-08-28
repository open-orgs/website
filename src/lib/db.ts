import type { SignInput } from './validate';

/**
 * Signatories are the only thing this site stores. Consultation requests are emailed on and
 * followed up from the inbox — they never touch D1.
 */
export async function insertSignatory(db: D1Database, input: SignInput): Promise<number> {
	const result = await db
		.prepare(
			`INSERT INTO signatories
			   (organisation_name, organisation_type, contact_name, contact_email, role)
			 VALUES (?, ?, ?, ?, ?)`
		)
		.bind(
			input.organisationName,
			input.organisationType,
			input.contactName,
			input.contactEmail,
			input.role || null
		)
		.run();

	return Number(result.meta.last_row_id);
}
