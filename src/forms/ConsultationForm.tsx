import { Dialog } from '../components/feedback/Dialog';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { ORGANIZATION_TYPES } from '../content/axes';

/**
 * Requesting an advisory call. Nothing here is stored — the request is sent on by email and
 * followed up from there, which is why the form asks only what a first conversation needs.
 */
export function ConsultationForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
	return (
		<Dialog
			name="consultation"
			eyebrow="Consultation"
			title="Request a call"
			intro="A conversation about what adopting the principles would mean for your organization. No cost, no engagement."
			submitLabel="Request a consultation"
			turnstileSiteKey={turnstileSiteKey}
		>
			<Input id="consult-organization" name="organizationName" label="Organization" required autocomplete="organization" />
			<Input id="consult-name" name="contactName" label="Your name" required autocomplete="name" />
			<Input id="consult-email" name="contactEmail" label="Your email" type="email" required autocomplete="email" />
			<Select id="consult-type" name="organizationType" label="Organization type" options={ORGANIZATION_TYPES} />
			<Input
				id="consult-context"
				name="context"
				label="What is prompting this?"
				multiline
				rows={4}
				hint="Optional. A constraint you are hitting, a decision under review, a structure you are rethinking."
			/>
		</Dialog>
	);
}
