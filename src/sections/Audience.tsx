import { OptimumField } from '../components/brand/OptimumField';
import { Eyebrow } from '../components/core/Eyebrow';
import { AUDIENCES } from '../content/axes';

/**
 * Replaces the prototype's "Voices" section. The full-bleed inverse block is a deliberate brand
 * device and stays; the testimonial it carried was invented and is gone, along with the
 * signatory-count claim beside it. Nothing here asserts how many organisations have adopted
 * anything, because nothing yet can.
 */
export function Audience() {
	return (
		<section class="oo-inverse" id="audience">
			<OptimumField tone="inverse" opacity={0.7} />
			<div class="oo-inverse__inner">
				<div>
					<Eyebrow tone="inverse">Who this is for</Eyebrow>
					<h2 class="oo-inverse__heading">A constraint on structure, not a fit for a sector</h2>
				</div>
				<div class="oo-inverse__side">
					<p class="oo-inverse__body">
						The principles constrain how decisions are routed, how roles are held, and where boundaries close — not
						what an organisation makes or who it answers to. There is no membership tier and no certification.
						Adopting them means keeping a practice, not buying one.
					</p>
					<div class="oo-pills">
						{AUDIENCES.map((a) => (
							<span class="oo-pill">{a}</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
