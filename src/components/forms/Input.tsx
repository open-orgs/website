import { Field, fieldDescribedBy } from './Field';

/** Single-line or multiline text field. */
interface InputProps {
	id: string;
	name: string;
	label: string;
	type?: 'text' | 'email' | 'tel';
	hint?: string;
	required?: boolean;
	multiline?: boolean;
	rows?: number;
	placeholder?: string;
	autocomplete?: string;
}

export function Input({ id, name, label, type = 'text', hint, required, multiline, rows = 4, placeholder, autocomplete }: InputProps) {
	return (
		<Field label={label} htmlFor={id} hint={hint} required={required}>
			{multiline ? (
				<textarea
					id={id}
					name={name}
					rows={rows}
					class="oo-input oo-input--multiline"
					placeholder={placeholder}
					required={required}
					aria-describedby={fieldDescribedBy(id, hint)}
				/>
			) : (
				<input
					id={id}
					name={name}
					type={type}
					class="oo-input"
					placeholder={placeholder}
					required={required}
					autocomplete={autocomplete}
					aria-describedby={fieldDescribedBy(id, hint)}
				/>
			)}
		</Field>
	);
}
