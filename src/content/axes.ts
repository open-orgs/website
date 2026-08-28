/**
 * The three principles. Names, order and axis wording are fixed by the brand and must never
 * be abbreviated, pluralized or re-worded. Ported verbatim from the design system's AXES table
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
	decision: 'Everyone materially affected by a decision has a route into it before it is drafted: not a veto, a route.',
	skills: 'Every role has at least two people who can hold it. Indispensability is a defect, not a distinction.',
	network: 'Every boundary is an interface. If a process cannot be joined from outside, it is not finished.',
};

/**
 * What each principle asks an organization to actually do.
 *
 * Every practice carries a `do` and a `dont` because the failure mode of all three principles is
 * the same: a version of the practice that is performed rather than held. The `dont` is the
 * performance. First-listed in each axis is the one the footer names.
 */
export interface Practice {
	title: string;
	body: string;
	do: string;
	dont: string;
}

export const PRACTICE_LEDE =
	'A principle you cannot audit is a preference. Each of the three resolves into the practices below: what to put in place, and the move it rules out.';

/** The line under each principle name in Practice: what the constraint actually binds. */
export const PRACTICE_INTRO: Record<AxisKey, string> = {
	decision: 'The constraint is on power, not on speed. A route in exists before the decision is drafted, and the decider still decides.',
	skills:
		'The constraint is on tenure, not on people. A role is held for a stated term, and the term is what makes a better holder findable.',
	network: 'The constraint is on the boundary, not on secrecy. What crosses it is decided in advance and written into the contract.',
};

/** The wrong reading of each principle. Rendered as a warn Callout under its practices. */
export const PRACTICE_CAVEAT: Record<AxisKey, { title: string; body: string }> = {
	decision: {
		title: 'Consultation is not a vote',
		body: 'All Affected guarantees a route in, not a veto. Averaging every position produces a decision nobody argued for, so the elected role still decides, and stands behind it: the alternatives weighed, the reason chosen, the objections not resolved.',
	},
	skills: {
		title: 'Replaceability is not churn',
		body: 'Constant rotation has a real cost: everyone who depends on a role has to re-learn it, and a promising change often underdelivers. That is exactly why the change is bound to a scheduled mandate review rather than to a crisis or a resignation. The competition is continuous. The switch is not.',
	},
	network: {
		title: 'Open is not public',
		body: 'The claim runs to affected parties, not to the world. A competitor is not an affected party. A supplier whose payroll depends on you is. So the boundary is planned rather than dissolved: what is open, to whom, and under which contract, is settled before anyone asks.',
	},
};

export const PRACTICE: Record<AxisKey, Practice[]> = {
	decision: [
		{
			title: 'Domain map',
			body: 'Each domain names an owner and a standing consult list, held loosely current rather than exhaustively correct. The list is who the owner designs with, not who the owner has to clear: putting the most affected and the most knowledgeable in one room is what produces the better decision. It runs on cooperative intent, and a party that will not hold that can be dropped by the owner and the rest of the list, at the risk of losing them.',
			do: 'List the parties who cannot push back: the supplier who depends on your volume, the customer inside a renewal, the team the change lands on.',
			dont: 'Circulate a finished decision for comment and count the comment window as consultation.',
		},
		{
			title: 'Objection log',
			body: 'Consultation is only testable if the overruled objections survive. Each objection is recorded with who raised it and the reason it did not change the outcome, and the log stays readable to everyone the decision affects. Being able to see what was argued against is what separates a route in from a suggestion box.',
			do: 'Close each decision with what was heard, what was chosen, and the risks the decider still carries.',
			dont: 'Retire an objection by waiting the objector out, or by editing it out of the notes.',
		},
		{
			title: 'No abusive terms',
			body: 'Do not hold a party to terms you would refuse yourself. Repeat business, referrals, and the benefit of the doubt when something breaks all come from the same place: the other side leaving fairly treated, every time. A win they would not have agreed to with open eyes is a loan against the relationship.',
			do: 'Price where a party with alternatives would still choose you, and make every clause cut both ways: same notice, same exit, same penalty.',
			dont: 'Win on the paperwork: auto-renewal on a window nobody catches, price changes only one side can make, exit fees, payment terms your supplier has to borrow against.',
		},
		{
			title: 'Owned by the affected',
			body: 'Ownership and board seats go to the most affected of each class, elected by it and guaranteed in the constitution rather than in a policy. Associations and public benefit corporations are built to be owned this way. Not every affected party needs to be inside the structure: the most involved are enough to hold a class well.',
			do: 'Name the affected classes, give each an elected seat, and put the guarantee where a later majority cannot vote it away.',
			dont: 'Draw the affected classes narrowly enough that the people already in charge are the only ones who qualify.',
		},
	],
	skills: [
		{
			title: 'Two-deep audit',
			body: 'Each critical role names a second and a third holder, and both have actually held it for a full cycle with the first holder unreachable. Two-deep is not vacation coverage. It is the floor that makes replacement possible at all: a role only one person can hold cannot be reviewed, only defended.',
			do: "Rotate the second holder in for a real cycle, and write the role's knowledge where a stranger could find it.",
			dont: 'Name a successor who has never made a decision the role owns.',
		},
		{
			title: 'Fixed mandates',
			body: "Every role is held for a stated term with a stated end date, the founder's included. The term ends whether or not anyone has complained, and ending it is not an accusation. This is what stops ownership, a contract clause, or long tenure from quietly converting a role into a permanent seat.",
			do: "Publish each mandate's start, its end, and the criteria the next review will measure.",
			dont: 'Treat "nothing has gone wrong" as the case for renewal.',
		},
		{
			title: 'Open renomination',
			body: 'Before a mandate ends the role is opened, and the incumbent applies against the field with a written plan like anyone else. The committee compares plans against published criteria, not people against incumbency. Continuity is a legitimate result. It just has to win.',
			do: 'Run the search before deciding the outcome, and publish which criteria the winning plan met.',
			dont: 'Open a role only after a failure, or run a search whose result was settled beforehand.',
		},
	],
	network: [
		{
			title: 'Interface inventory',
			body: 'Every internal process publishes the interface an outsider would use: the input it accepts, the output it returns, and who is entitled to call it. That covers software, and also accounting, roles, partners and subcontracting. Closure is the default and opening is the work, so the inventory is a list of what is still closed, with an owner and a date against each line.',
			do: 'Decide in advance where the outside may connect: which code is open, which APIs, which contracts, which programs.',
			dont: 'Count a relationship, an introduction, or a shared inbox as an interface.',
		},
		{
			title: 'Right of access',
			body: 'Access is written into the contract, not granted as a favor. Every affected party, employee, partner, supplier or customer, has a named route to the records that bear on them: accounting, role criteria, subcontractor terms. Secrecy is justified by the harm it prevents, never by the scrutiny it avoids.',
			do: 'Name in the contract what an affected party may read, and how they ask for it.',
			dont: 'Classify as confidential what puts no one at physical or psychological risk.',
		},
		{
			title: 'Exit test',
			body: 'A partner or customer can leave with their data, their configuration and their history, in a format the next provider can read, and the path out is published and timed. Revenue that survives that test is paid for value delivered. Revenue that only survives the cost of leaving is paid for a moat.',
			do: 'Publish the export, the switching path and how long it takes, then check it by running it.',
			dont: 'Engineer incompatibility and call the result a competitive advantage.',
		},
	],
};

export const ORGANIZATION_TYPES = ['Enterprise', 'SME', 'Startup', 'Academic', 'Public sector', 'Cooperative'] as const;

/** Who the principles are addressed to. Deliberately broad — not a claim about adoption. */
export const AUDIENCES = ['Enterprise', 'SME', 'Startups', 'Academic', 'Public sector', 'Cooperatives'] as const;

export const STATEMENT = 'In pursuit of the optimal organization.';
