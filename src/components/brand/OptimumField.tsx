/**
 * The background field: two families of curves and the optima where they meet. Structure and
 * evidence, never decoration — every dot is a solved crossing, not a placed one.
 *
 * This renders the skeleton only. The curves and crossings are solved at runtime against the
 * container and the live text boxes by public/js/optimum-field.js, which finds these elements
 * via the data-oo-* attributes below.
 */
interface OptimumFieldProps {
	tone?: 'light' | 'inverse';
	opacity?: number;
	class?: string;
}

export function OptimumField({ tone = 'light', opacity = 1, class: cls }: OptimumFieldProps) {
	const inverse = tone === 'inverse';
	return (
		<svg
			data-oo-field
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid meet"
			aria-hidden="true"
			class={['oo-optimum-field', cls].filter(Boolean).join(' ')}
			style={`opacity:${opacity}`}
		>
			<g fill="none" stroke-width="1.4">
				<path data-oo-desc="0" stroke={inverse ? 'var(--navy-600)' : 'var(--navy-200)'} />
				<path data-oo-desc="1" stroke={inverse ? 'var(--navy-600)' : 'var(--navy-200)'} />
				<path data-oo-asc="0" stroke={inverse ? 'var(--navy-500)' : 'var(--navy-300)'} opacity="0.75" />
				<path data-oo-asc="1" stroke={inverse ? 'var(--navy-500)' : 'var(--navy-300)'} opacity="0.75" />
			</g>
			<g>
				<circle data-oo-dot="0" r="4.4" opacity="0" fill={inverse ? 'var(--navy-300)' : 'var(--axis-network)'} />
				<circle data-oo-dot="1" r="4.4" opacity="0" fill={inverse ? 'var(--navy-300)' : 'var(--axis-network)'} />
				<circle data-oo-dot="2" r="4.4" opacity="0" fill={inverse ? 'var(--navy-300)' : 'var(--axis-network)'} />
				<circle data-oo-dot="3" r="4.4" opacity="0" fill={inverse ? 'var(--navy-300)' : 'var(--axis-network)'} />
			</g>
		</svg>
	);
}
