import type { Child } from 'hono/jsx';

/**
 * Inline notice for an aside the reader must not miss: a caveat, a definition, a risk. Tinted
 * surface, 2px left rule in the tone color, square on the left so the rule reads as a rule.
 *
 * This is the only place in the system a colored left border is allowed. Do not reach for it as a
 * generic tinted box — Card `tone="quiet"` is that.
 */
interface CalloutProps {
	children?: Child;
	title?: string;
	tone?: 'info' | 'ok' | 'warn' | 'risk';
	class?: string;
}

export function Callout({ children, title, tone = 'info', class: cls }: CalloutProps) {
	return (
		<div class={['oo-callout', `oo-callout--${tone}`, cls].filter(Boolean).join(' ')}>
			{title && <div class="oo-callout__title">{title}</div>}
			<p class="oo-callout__body">{children}</p>
		</div>
	);
}
