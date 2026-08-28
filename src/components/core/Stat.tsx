import type { AxisKey } from '../../content/axes';

/**
 * A number and its label, set in the display serif. Evidence, not decoration.
 *
 * The brand rule: a number without a source line does not ship. Only use this for figures that
 * are true by construction, or that carry a stated source in the label.
 */
interface StatProps {
	value: string;
	label: string;
	unit?: string;
	axis?: AxisKey;
}

export function Stat({ value, label, unit, axis }: StatProps) {
	return (
		<div class="oo-stat">
			<div class="oo-stat__value" style={axis ? `color:var(--axis-${axis})` : undefined}>
				{value}
				{unit && <span class="oo-stat__unit">{unit}</span>}
			</div>
			<div class="oo-stat__label">{label}</div>
		</div>
	);
}
