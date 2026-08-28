import { OptimumField } from '../components/brand/OptimumField';
import { Eyebrow } from '../components/core/Eyebrow';
import { Button } from '../components/core/Button';
import { Icon } from '../components/core/Icon';
import { Stat } from '../components/core/Stat';

/**
 * The two stats are true by construction — a count of the axes, and a licence fee of zero.
 * Neither is a claim about surveyed organisations, so neither needs a source line it cannot have.
 */
export function Hero() {
	return (
		<section class="oo-hero" id="top">
			<OptimumField opacity={0.85} />
			<div class="oo-hero__inner">
				<Eyebrow index={0} tone="accent">
					A set of principles, not a methodology
				</Eyebrow>
				<h1 class="oo-hero__heading">Organisations are networks, or they are bottlenecks.</h1>
				<p class="oo-hero__lede">
					Open Orgs is a search for the optimal form of human and agent organisation — long-lasting, economically
					efficient, socially optimal. Three principles. Three axes. No proprietary framework.
				</p>
				<div class="oo-hero__actions">
					<Button size="lg" href="#principles" iconAfter={<Icon name="arrow-right" size={18} />}>
						Read the three principles
					</Button>
					<Button size="lg" variant="secondary" href="#join">
						Adopt them, or ask about them
					</Button>
				</div>
				<div class="oo-hero__stats">
					<Stat value="3" label="optimization axes, each governed by exactly one principle" />
					<Stat value="0" label="licence fees. The principles are in the public domain." />
				</div>
			</div>
		</section>
	);
}
