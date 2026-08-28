import { Eyebrow } from '../components/core/Eyebrow';
import { PrincipleCard } from '../components/brand/PrincipleCard';
import { AXIS_ORDER, PRINCIPLE_COPY } from '../content/axes';

export function Principles() {
	return (
		<section class="oo-section oo-principles" id="principles">
			<div class="oo-section__head">
				<div>
					<Eyebrow index={1} tone="accent">
						The principles
					</Eyebrow>
					<h2 class="oo-section__heading">Three constraints</h2>
				</div>
				<p class="oo-section__aside">
					Each principle pushes one axis to its extreme. Taken together they describe an organization where every decision has a route in,
					every role has more than one holder, and every boundary stays open.
				</p>
			</div>
			<div class="oo-principles__grid">
				{AXIS_ORDER.map((axis) => (
					<PrincipleCard axis={axis} body={PRINCIPLE_COPY[axis]} />
				))}
			</div>
		</section>
	);
}
