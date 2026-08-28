import type { Child } from 'hono/jsx';

/**
 * Label / control / hint wrapper. The error slot is always rendered (empty) so the client can
 * fill it in place without reflowing the dialog, and is wired to the control by aria-describedby.
 */
interface FieldProps {
	label: string;
	htmlFor: string;
	hint?: string;
	required?: boolean;
	children?: Child;
}

/**
 * The ids a control inside a Field must point at: the hint, when there is one, and the error slot,
 * which is always rendered. Minted here, next to the elements that own them — a control spelling
 * the ids out by hand drifts the moment either element changes.
 */
export function fieldDescribedBy(id: string, hint?: string): string {
	return hint ? `${id}-hint ${id}-error` : `${id}-error`;
}

export function Field({ label, htmlFor, hint, required, children }: FieldProps) {
	return (
		<div class="oo-field">
			<label class="oo-field__label" for={htmlFor}>
				{label}
				{required && <span class="oo-field__required">*</span>}
			</label>
			{children}
			{hint && (
				<div class="oo-field__hint" id={`${htmlFor}-hint`}>
					{hint}
				</div>
			)}
			<div class="oo-field__error" id={`${htmlFor}-error`} data-oo-error-for={htmlFor} hidden />
		</div>
	);
}
