import { OrgMark } from '../brand/OrgMark';
import { Logotype } from '../brand/Logotype';
import { AxisMark } from '../brand/AxisMark';
import { Button } from '../core/Button';
import { AXES, AXIS_ORDER, STATEMENT } from '../../content/axes';

/**
 * The footer is where the identity closes: the lockup, the statement, and the three principles.
 * Not a copyright or "public domain" strip — the design system is explicit that one must not be
 * added back.
 */
interface Column {
	title: string;
	items: string[];
}

export function SiteFooter({ columns }: { columns: Column[] }) {
	return (
		<footer class="oo-footer">
			<div class="oo-footer__top">
				<div class="oo-footer__brand">
					<span class="oo-footer__lockup">
						<OrgMark variant="mark" size={30} tone="inverse" />
						<Logotype size={26} tone="inverse" />
					</span>
					<p class="oo-footer__statement">{STATEMENT}</p>
					<Button variant="inverse" size="sm" data-oo-open="sign">
						Adopt the principles
					</Button>
				</div>
				{columns.map((col) => (
					<div>
						<div class="oo-footer__col-title">{col.title}</div>
						<ul class="oo-footer__list">
							{col.items.map((i) => (
								<li class="oo-footer__item">{i}</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<div class="oo-footer__principles">
				<div class="oo-footer__principles-inner">
					{AXIS_ORDER.map((k) => (
						<div class="oo-footer__principle">
							<AxisMark axis={k} size={28} tone="inverse" />
							<span>
								<span class="oo-footer__principle-axis">
									{String(AXES[k].n).padStart(2, '0')} · {AXES[k].axis}
								</span>
								<span class="oo-footer__principle-name">{AXES[k].label}</span>
								<span class="oo-footer__principle-optimizes">{AXES[k].optimizes}</span>
							</span>
						</div>
					))}
				</div>
			</div>
		</footer>
	);
}
