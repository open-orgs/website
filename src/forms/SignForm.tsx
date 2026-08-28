import { Dialog } from '../components/feedback/Dialog';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Checkbox } from '../components/forms/Checkbox';
import { ORGANIZATION_TYPES } from '../content/axes';

/** Adding an organization to the principles. Microcopy explains the constraint, not the control. */
export function SignForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
	return (
		<Dialog
			name="sign"
			eyebrow="Signatory"
			title="Add your organization"
			intro="Signing records that your organization adopts all three principles, and the date it did."
			submitLabel="Sign the principles"
			turnstileSiteKey={turnstileSiteKey}
		>
			<Input id="sign-organization" name="organizationName" label="Organization" required autocomplete="organization" />
			<Select id="sign-type" name="organizationType" label="Organization type" options={ORGANIZATION_TYPES} required />
			<Input id="sign-name" name="contactName" label="Your name" required autocomplete="name" />
			<Input id="sign-email" name="contactEmail" label="Your email" type="email" required autocomplete="email" />
			<Input id="sign-role" name="role" label="Your role" hint="Optional." autocomplete="organization-title" />
			<Checkbox id="sign-ack" name="ack" label="We adopt all three principles" description="Partial adoption is not listed." required />
		</Dialog>
	);
}
