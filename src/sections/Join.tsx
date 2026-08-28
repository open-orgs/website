import { Eyebrow } from '../components/core/Eyebrow';
import { Card } from '../components/core/Card';
import { Button } from '../components/core/Button';

/**
 * The two goals, at equal weight: two cards of identical size and treatment, neither tinted to
 * favour the other. The header cannot deliver that parity — two solid buttons side by side read
 * as indecisive — so it is delivered here.
 */
export function Join() {
	return (
		<section class="oo-section oo-join" id="join">
			<div class="oo-join__intro">
				<Eyebrow index={3} tone="accent">
					Join
				</Eyebrow>
				<h2 class="oo-section__heading">Two ways in</h2>
				<p class="oo-join__lede">
					Adopt the principles and record it, or talk it through first. Neither costs anything, and neither commits you to the other.
				</p>
			</div>
			<div class="oo-join__cards">
				<Card class="oo-join__card">
					<h3 class="oo-join__card-title">Sign the principles</h3>
					<p class="oo-join__card-body">
						Adopt all three principles and record your organisation and the date it adopted them. Partial adoption is not listed.
					</p>
					<Button block size="lg" class="oo-join__card-action" data-oo-open="sign">
						Sign the principles
					</Button>
				</Card>
				<Card class="oo-join__card">
					<h3 class="oo-join__card-title">Request a consultation</h3>
					<p class="oo-join__card-body">
						A call about what adopting the principles would mean for your organisation — where they would bind, and what would have to
						change. No cost, no engagement.
					</p>
					<Button block size="lg" variant="secondary" class="oo-join__card-action" data-oo-open="consultation">
						Request a consultation
					</Button>
				</Card>
			</div>
		</section>
	);
}
