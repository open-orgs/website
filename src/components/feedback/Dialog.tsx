import type { Child } from 'hono/jsx';
import { Button } from '../core/Button';

/**
 * A form in a modal. Built on the native <dialog> element rather than the design system's
 * hand-rolled fixed overlay: focus trapping, Esc-to-close and top-layer stacking come for free,
 * which is strictly less code than reproducing them. The scrim is ::backdrop in site.css.
 *
 * 24px radius — panels are always one step rounder than the cards inside them.
 */
interface DialogProps {
	name: string;
	eyebrow: string;
	title: string;
	intro?: string;
	submitLabel: string;
	turnstileSiteKey: string;
	children?: Child;
}

export function Dialog({ name, eyebrow, title, intro, submitLabel, turnstileSiteKey, children }: DialogProps) {
	const titleId = `dialog-${name}-title`;
	return (
		<dialog id={`dialog-${name}`} class="oo-dialog" aria-labelledby={titleId} data-oo-dialog={name}>
			<form class="oo-dialog__form" data-oo-form={name} novalidate>
				<div class="oo-dialog__eyebrow">{eyebrow}</div>
				<h2 class="oo-dialog__title" id={titleId}>
					{title}
				</h2>
				{intro && <p class="oo-dialog__intro">{intro}</p>}

				<div class="oo-dialog__body">{children}</div>

				<div
					class="cf-turnstile oo-turnstile"
					data-sitekey={turnstileSiteKey}
					data-action={name}
					data-appearance="interaction-only"
				/>

				<p class="oo-dialog__status" role="alert" data-oo-status hidden />

				<div class="oo-dialog__footer">
					<Button variant="ghost" data-oo-close>
						Not yet
					</Button>
					<Button type="submit" data-oo-submit>
						{submitLabel}
					</Button>
				</div>
			</form>
		</dialog>
	);
}
