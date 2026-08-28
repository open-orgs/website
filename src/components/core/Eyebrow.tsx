import type { Child } from 'hono/jsx';

/** Mono, uppercase, wide-tracked label that sits above a heading. Optionally numbered. */
interface EyebrowProps {
	children?: Child;
	index?: number;
	tone?: 'muted' | 'accent' | 'inverse';
	class?: string;
}

export function Eyebrow({ children, index, tone = 'muted', class: cls }: EyebrowProps) {
	return (
		<div class={['oo-eyebrow', `oo-eyebrow--${tone}`, cls].filter(Boolean).join(' ')}>
			{index != null && <span class="oo-eyebrow__index">{String(index).padStart(2, '0')}</span>}
			{index != null && <span aria-hidden="true" class="oo-eyebrow__rule" />}
			<span>{children}</span>
		</div>
	);
}
