/**
 * The Open Orgs symbol. An outer O; two curves entering from outside it; and where they
 * meet, the optimum — itself a small O, never a filled dot.
 *
 * Never: fill the inner O solid, stop the curves at the outer ring, rotate the pair off
 * horizontal, add a third curve, or place the mark inside a button or badge.
 */
type Tone = 'ink' | 'accent' | 'inverse' | 'mono';
type Variant = 'mark' | 'lens' | 'tiers';

const TONES: Record<Tone, { ring: string; curve: string; opt: string; fill: string }> = {
	ink: { ring: 'var(--navy-900)', curve: 'var(--navy-400)', opt: 'var(--axis-decision)', fill: 'var(--gray-0)' },
	accent: { ring: 'var(--navy-700)', curve: 'var(--navy-300)', opt: 'var(--axis-network)', fill: 'var(--gray-0)' },
	inverse: { ring: '#ffffff', curve: 'var(--navy-300)', opt: '#ffffff', fill: 'var(--navy-900)' },
	mono: { ring: 'currentColor', curve: 'currentColor', opt: 'currentColor', fill: 'none' },
};

interface OrgMarkProps {
	variant?: Variant;
	size?: number;
	tone?: Tone;
	rings?: number;
	label?: string;
	class?: string;
}

export function OrgMark({ variant = 'mark', size = 40, tone = 'ink', rings = 4, label, class: cls }: OrgMarkProps) {
	const t = TONES[tone];
	// Below 26px the strokes thicken and the inner O grows, so the center stays open at 16px.
	const small = size < 26;
	const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };
	const common = { viewBox: '0 0 64 64', width: size, height: size, class: cls, ...a11y };

	if (variant === 'tiers') {
		const r = [26, 19, 12, 6].slice(0, Math.max(2, Math.min(4, rings)));
		return (
			<svg {...common}>
				{r.map((rr, i) => (
					<circle
						cx="32"
						cy="32"
						r={rr}
						fill={i === r.length - 1 ? t.opt : 'none'}
						stroke={i === r.length - 1 ? 'none' : t.ring}
						stroke-width={small ? 3 : 2.4}
						opacity={i === r.length - 1 ? 1 : 1 - i * 0.2}
					/>
				))}
			</svg>
		);
	}

	// The optimum alone — favicon, avatar, app icon, bullet.
	if (variant === 'lens') {
		return (
			<svg {...common}>
				<circle cx="32" cy="32" r={small ? 22 : 20} fill={t.fill} stroke={t.opt} stroke-width={small ? 9 : 8} />
			</svg>
		);
	}

	return (
		<svg {...common}>
			<circle cx="32" cy="32" r="24" fill="none" stroke={t.ring} stroke-width={small ? 3.4 : 2.6} />
			<path d="M2 4 C20 16 44 48 62 60" fill="none" stroke={t.curve} stroke-width={small ? 2.6 : 2} stroke-linecap="round" />
			<path d="M2 60 C20 48 44 16 62 4" fill="none" stroke={t.curve} stroke-width={small ? 2.6 : 2} stroke-linecap="round" />
			<circle cx="32" cy="32" r={small ? 9 : 8} fill={t.fill} stroke={t.opt} stroke-width={small ? 3.2 : 2.6} />
		</svg>
	);
}
