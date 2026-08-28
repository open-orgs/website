/**
 * Checkbox with an optional description line. The native input is visually hidden but still the
 * real control — checked state drives the custom box through a CSS sibling selector, so this
 * works with no JavaScript and keeps native keyboard and validation behaviour.
 *
 * Never ships pre-checked: adopting the principles is the user's action, not a default.
 */
interface CheckboxProps {
	id: string;
	name: string;
	label: string;
	description?: string;
	required?: boolean;
}

export function Checkbox({ id, name, label, description, required }: CheckboxProps) {
	return (
		<div class="oo-field">
			<label class="oo-checkbox" for={id}>
				<input
					id={id}
					name={name}
					type="checkbox"
					class="oo-checkbox__input"
					required={required}
					aria-describedby={`${id}-error`}
				/>
				<span aria-hidden="true" class="oo-checkbox__box">
					<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 6 9 17l-5-5" />
					</svg>
				</span>
				<span class="oo-checkbox__text">
					<span class="oo-checkbox__label">{label}</span>
					{description && <span class="oo-checkbox__description">{description}</span>}
				</span>
			</label>
			<div class="oo-field__error" id={`${id}-error`} data-oo-error-for={id} hidden />
		</div>
	);
}
