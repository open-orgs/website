import { Eyebrow } from '../components/core/Eyebrow';
import { Card } from '../components/core/Card';
import { AxisMark } from '../components/brand/AxisMark';
import { AXIS_ORDER, PRACTICE } from '../content/axes';

/**
 * The prototype put a "Playbook" link on each row. Those playbooks do not exist yet, and a link
 * that goes nowhere breaks the brand's own rule about specific, verb-first actions. They come
 * back when there is something behind them.
 */
export function Practice() {
	return (
		<section class="oo-band" id="practice">
			<div class="oo-band__inner">
				<Eyebrow index={2} tone="accent">
					Practice
				</Eyebrow>
				<h2 class="oo-section__heading">What each principle asks you to actually do</h2>
				<div class="oo-practice__rows">
					{AXIS_ORDER.map((axis) => (
						<Card class="oo-practice__row">
							<AxisMark axis={axis} size={40} active />
							<div>
								<h3 class="oo-practice__title">{PRACTICE[axis].title}</h3>
								<p class="oo-practice__body">{PRACTICE[axis].body}</p>
							</div>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
