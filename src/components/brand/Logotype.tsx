/**
 * The wordmark. Type only — the name IS the mark. The two O's are the structural pair:
 * set tight, optically matched, never separated. Never set in the sans.
 */
const SIZES = { sm: 19, md: 25, lg: 39, xl: 62 } as const;

interface LogotypeProps {
	size?: number | keyof typeof SIZES;
	tone?: 'default' | 'inverse';
	class?: string;
}

export function Logotype({ size = 'md', tone = 'default', class: cls }: LogotypeProps) {
	const px = typeof size === 'number' ? size : SIZES[size];
	return (
		<span
			class={['oo-logotype', tone === 'inverse' ? 'oo-logotype--inverse' : '', cls].filter(Boolean).join(' ')}
			style={`font-size:${px}px`}
		>
			<span class="oo-logotype__o">O</span>pen&nbsp;<span class="oo-logotype__o">O</span>rgs
		</span>
	);
}
