import { AxisMark } from './AxisMark';
import { AXES, type AxisKey } from '../../content/axes';

/**
 * One of the three principles, as a card. Order is always decision → skills → network, and the
 * names come from AXES so they cannot drift.
 */
export function PrincipleCard({ axis, body }: { axis: AxisKey; body: string }) {
	const meta = AXES[axis];
	return (
		<div class={`oo-principle oo-principle--${axis}`}>
			<span aria-hidden="true" class="oo-principle__edge" />
			<div class="oo-principle__head">
				<div class="oo-principle__axis">
					{String(meta.n).padStart(2, '0')} · {meta.axis}
				</div>
				<AxisMark axis={axis} size={44} />
			</div>
			<h3 class="oo-principle__name">{meta.label}</h3>
			<p class="oo-principle__optimizes">{meta.optimizes}</p>
			<p class="oo-principle__body">{body}</p>
		</div>
	);
}
