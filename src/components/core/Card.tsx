import type { Child } from 'hono/jsx';
import type { AxisKey } from '../../content/axes';

/**
 * White surface, hairline border, 16px radius. Shadow appears on hover only, never at rest.
 * `axis` paints a 2px top edge in a principle colour.
 */
interface CardProps {
	children?: Child;
	axis?: AxisKey;
	interactive?: boolean;
	tone?: 'default' | 'sunken' | 'quiet' | 'inverse';
	class?: string;
	[key: string]: unknown;
}

export function Card({ children, axis, interactive, tone = 'default', class: cls, ...rest }: CardProps) {
	const className = ['oo-card', tone !== 'default' ? `oo-card--${tone}` : '', interactive ? 'oo-card--interactive' : '', cls]
		.filter(Boolean)
		.join(' ');
	return (
		<div class={className} {...rest}>
			{axis && <span aria-hidden="true" class="oo-card__edge" style={`background:var(--axis-${axis})`} />}
			{children}
		</div>
	);
}
