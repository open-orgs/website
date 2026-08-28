import { Layout } from '../layout/Layout';
import { SiteHeader } from '../components/navigation/SiteHeader';
import { SiteFooter } from '../components/navigation/SiteFooter';
import { Hero } from '../sections/Hero';
import { Principles } from '../sections/Principles';
import { Practice } from '../sections/Practice';
import { Audience } from '../sections/Audience';
import { Join } from '../sections/Join';
import { SignForm } from '../forms/SignForm';
import { ConsultationForm } from '../forms/ConsultationForm';
import { Toast } from '../components/feedback/Toast';
import { AXES, AXIS_ORDER, PRACTICE } from '../content/axes';

const NAV = [
	{ href: '#principles', label: 'Principles' },
	{ href: '#practice', label: 'Practice' },
	{ href: '#join', label: 'Join' },
];

// Both columns are derived, so neither can drift from the section it names. The footer lists the
// first practice of each axis, not all nine: it is a pointer, not the chapter.
const FOOTER_COLUMNS = [
	{ title: 'Principles', items: AXIS_ORDER.map((k) => AXES[k].label) },
	{ title: 'Practice', items: AXIS_ORDER.map((k) => PRACTICE[k][0].title) },
];

export function HomePage({ turnstileSiteKey }: { turnstileSiteKey: string }) {
	return (
		<Layout
			title="Open Orgs: three principles for the optimal form of organization"
			description="A search for the optimal form of human and agent organization: long-lasting, economically efficient, socially optimal. Three principles, three axes, no proprietary framework."
		>
			<SiteHeader links={NAV} />
			<main>
				<Hero />
				<Principles />
				<Practice />
				<Audience />
				<Join />
			</main>
			<SiteFooter columns={FOOTER_COLUMNS} />
			<SignForm turnstileSiteKey={turnstileSiteKey} />
			<ConsultationForm turnstileSiteKey={turnstileSiteKey} />
			<Toast />
		</Layout>
	);
}
