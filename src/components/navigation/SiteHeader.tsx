import { OrgMark } from '../brand/OrgMark';
import { Logotype } from '../brand/Logotype';
import { Button } from '../core/Button';

/**
 * Sticky site header: lockup left, links centre-right, two actions.
 *
 * The design system's version carries one action. This site has two goals of equal standing, so
 * it carries both — primary solid, secondary ghost. Two solid buttons side by side would read as
 * indecisive; true parity between the two goals is delivered by the Join section, not here.
 * The secondary action is hidden on narrow viewports, where Join is a short scroll away.
 */
interface Link {
	href: string;
	label: string;
}

export function SiteHeader({ links }: { links: Link[] }) {
	return (
		<header class="oo-header">
			<div class="oo-header__inner">
				<a class="oo-header__lockup" href="#top" aria-label="Open Orgs home">
					<OrgMark variant="mark" size={22} tone="ink" />
					<Logotype size={21} />
				</a>
				<nav class="oo-header__nav">
					{links.map((l) => (
						<a class="oo-header__link" href={l.href}>
							{l.label}
						</a>
					))}
				</nav>
				<div class="oo-header__actions">
					<Button variant="ghost" size="sm" class="oo-header__secondary" data-oo-open="consultation">
						Request a consultation
					</Button>
					<Button size="sm" data-oo-open="sign">
						Sign the principles
					</Button>
				</div>
			</div>
		</header>
	);
}
