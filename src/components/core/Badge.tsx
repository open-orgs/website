import type { Child } from 'hono/jsx';

/** Small mono status label. Non-interactive, at most four words, UPPERCASE. */
interface BadgeProps {
	children?: Child;
	tone?: 'neutral' | 'navy' | 'decision' | 'skills' | 'network' | 'ok' | 'warn' | 'risk' | 'solid';
	class?: string;
}

export function Badge({ children, tone = 'neutral', class: cls }: BadgeProps) {
	return <span class={['oo-badge', `oo-badge--${tone}`, cls].filter(Boolean).join(' ')}>{children}</span>;
}
