/**
 * The three principles. Names, order and axis wording are fixed by the brand and must never
 * be abbreviated, pluralised or re-worded. Ported verbatim from the design system's AXES table
 * (.claude/skills/open-orgs-design/components/brand/AxisMark.jsx) — this file is the only
 * source of truth for them in the app.
 */
export type AxisKey = 'decision' | 'skills' | 'network';

export interface Axis {
	n: number;
	label: string;
	axis: string;
	short: string;
	optimizes: string;
	toward: string;
}

export const AXES: Record<AxisKey, Axis> = {
	decision: {
		n: 1,
		label: 'All Affected',
		axis: 'Decision optimization',
		short: 'Decision',
		optimizes: 'extreme consultation',
		toward: 'toward the optimal decision',
	},
	skills: {
		n: 2,
		label: 'No One Is Indispensable',
		axis: 'Skills optimization',
		short: 'Skills',
		optimizes: 'extreme competition',
		toward: 'toward the optimal allocation of skill',
	},
	network: {
		n: 3,
		label: 'Open Systems',
		axis: 'Network optimization',
		short: 'Network',
		optimizes: 'extreme integration',
		toward: 'toward the optimal network',
	},
};

/** The order is fixed and never varies. */
export const AXIS_ORDER: AxisKey[] = ['decision', 'skills', 'network'];

export const PRINCIPLE_COPY: Record<AxisKey, string> = {
	decision: 'Everyone materially affected by a decision has a route into it before it is drafted — not a veto, a route.',
	skills: 'Every role has at least two people who can hold it. Indispensability is a defect, not a distinction.',
	network: 'Every boundary is an interface. If a process cannot be joined from outside, it is not finished.',
};

/** What each principle asks an organisation to actually do. */
export const PRACTICE: Record<AxisKey, { title: string; body: string }> = {
	decision: {
		title: 'Decision register',
		body: 'Every decision names who it affects before it names who decides.',
	},
	skills: {
		title: 'Two-deep audit',
		body: 'Each critical role lists its second and third holder, reviewed quarterly.',
	},
	network: {
		title: 'Interface inventory',
		body: 'Every internal process publishes the interface an outsider would use.',
	},
};

export const ORGANISATION_TYPES = ['Enterprise', 'SME', 'Startup', 'Academic', 'Public sector', 'Co-operative'] as const;

/** Who the principles are addressed to. Deliberately broad — not a claim about adoption. */
export const AUDIENCES = ['Enterprise', 'SME', 'Startups', 'Academic', 'Public sector', 'Co-operatives'] as const;

export const STATEMENT = 'Organisations are networks, or they are bottlenecks.';
