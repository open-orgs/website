import { Field, fieldDescribedBy } from './Field';

/** Native select with the brand chevron. */
interface SelectProps {
	id: string;
	name: string;
	label: string;
	options: readonly string[];
	placeholder?: string;
	hint?: string;
	required?: boolean;
}

export function Select({ id, name, label, options, placeholder = 'Select…', hint, required }: SelectProps) {
	return (
		<Field label={label} htmlFor={id} hint={hint} required={required}>
			<div class="oo-select">
				<select id={id} name={name} class="oo-select__control" required={required} aria-describedby={fieldDescribedBy(id, hint)}>
					<option value="">{placeholder}</option>
					{options.map((o) => (
						<option value={o}>{o}</option>
					))}
				</select>
				<svg
					aria-hidden="true"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
					class="oo-select__chevron"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</div>
		</Field>
	);
}
