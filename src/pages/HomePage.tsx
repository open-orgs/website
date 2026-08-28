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
import { AXES, AXIS_ORDER } from '../content/axes';

const NAV = [
	{ href: '#principles', label: 'Principles' },
	{ href: '#practice', label: 'Practice' },
	{ href: '#audience', label: 'Who this is for' },
	{ href: '#join', label: 'Join' },
];

const FOOTER_COLUMNS = [
	{ title: 'Principles', items: AXIS_ORDER.map((k) => AXES[k].label) },
	{ title: 'Practice', items: ['Decision register', 'Two-deep audit', 'Interface inventory'] },
];

export function HomePage({ turnstileSiteKey }: { turnstileSiteKey: string }) {
	return (
		<Layout
			title="Open Orgs — three principles for the optimal form of organisation"
			description="A search for the optimal form of human and agent organisation: long-lasting, economically efficient, socially optimal. Three principles, three axes, no proprietary framework."
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
