import { ICONS, type IconName } from './icons';

/**
 * Stroke icons. Weight 1.75 at every size, sizes 16/18/20/24 only, currentColor always —
 * an icon never carries its own colour, and is never filled.
 */
interface IconProps {
	name: IconName;
	size?: 16 | 18 | 20 | 24;
	class?: string;
}

export function Icon({ name, size = 18, class: cls }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class={['oo-icon', cls].filter(Boolean).join(' ')}
		>
			{ICONS[name].map((d) => (
				<path d={d} />
			))}
		</svg>
	);
}
