import { Eyebrow } from '../components/core/Eyebrow';
import { Card } from '../components/core/Card';
import { Callout } from '../components/core/Callout';
import { Icon } from '../components/core/Icon';
import { AxisMark } from '../components/brand/AxisMark';
import {
	AXES,
	AXIS_ORDER,
	PRACTICE,
	PRACTICE_CAVEAT,
	PRACTICE_INTRO,
	PRACTICE_LEDE,
	type Practice as PracticeEntry,
} from '../content/axes';

/**
 * The prototype put a "Playbook" link on each row. Those playbooks do not exist yet, and a link
 * that goes nowhere breaks the brand's own rule about specific, verb-first actions. They come
 * back when there is something behind them.
 *
 * The AxisMark appears once per group, not once per card: it is brand furniture, and repeating the
 * same mark three times in a row would be decoration. Per-card axis identity is the Card `axis`
 * edge instead, which is the licensed way to color a card.
 */
function PracticeRow({ axis, practice }: { axis: (typeof AXIS_ORDER)[number]; practice: PracticeEntry }) {
	return (
		<Card axis={axis} class="oo-practice__row">
			<div>
				<h4 class="oo-practice__title">{practice.title}</h4>
				<p class="oo-practice__body">{practice.body}</p>
			</div>
			<div class="oo-practice__rules">
				<div class="oo-practice__rule oo-practice__rule--do">
					<div class="oo-practice__rule-label">
						<Icon name="check" size={16} />
						Do
					</div>
					<p class="oo-practice__rule-text">{practice.do}</p>
				</div>
				<div class="oo-practice__rule oo-practice__rule--dont">
					<div class="oo-practice__rule-label">
						<Icon name="x" size={16} />
						Don't
					</div>
					<p class="oo-practice__rule-text">{practice.dont}</p>
				</div>
			</div>
		</Card>
	);
}

export function Practice() {
	return (
		<section class="oo-band oo-band--tall" id="practice">
			<div class="oo-band__inner">
				<div class="oo-section__head">
					<div>
						<Eyebrow index={2} tone="accent">
							Practice
						</Eyebrow>
						<h2 class="oo-section__heading">What each principle asks you to actually do</h2>
					</div>
					<p class="oo-section__aside">{PRACTICE_LEDE}</p>
				</div>

				{AXIS_ORDER.map((axis) => (
					<div class={`oo-practice__group oo-practice__group--${axis}`} id={`practice-${axis}`}>
						<header class="oo-practice__group-head">
							<AxisMark axis={axis} size={44} active />
							<div>
								<div class="oo-practice__axis">
									{String(AXES[axis].n).padStart(2, '0')} · {AXES[axis].axis}
								</div>
								<h3 class="oo-practice__principle">{AXES[axis].label}</h3>
								<p class="oo-practice__intro">{PRACTICE_INTRO[axis]}</p>
							</div>
						</header>
						<div class="oo-practice__rows">
							{PRACTICE[axis].map((practice) => (
								<PracticeRow axis={axis} practice={practice} />
							))}
						</div>
						<Callout tone="warn" title={PRACTICE_CAVEAT[axis].title} class="oo-practice__caveat">
							{PRACTICE_CAVEAT[axis].body}
						</Callout>
					</div>
				))}
			</div>
		</section>
	);
}
