/**
 * Icon path data, copied once from lucide-static v1.35.0 (ISC). Only the icons this site
 * actually uses — the design system's prototype pulled the whole Lucide UMD build from a CDN,
 * which is neither needed nor allowed here.
 *
 * Lucide is a flagged substitution in the design system, not a supplied icon set.
 */
export const ICONS = {
	'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
	'arrow-up-right': ['M7 7h10v10', 'M7 17 17 7'],
	check: ['M20 6 9 17l-5-5'],
	x: ['M18 6 6 18', 'm6 6 12 12'],
} as const;

export type IconName = keyof typeof ICONS;
