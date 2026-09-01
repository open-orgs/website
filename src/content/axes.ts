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
	network: 'Every boundary is an interface. A unit that cannot be joined from outside is not open.',
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
	decision:
		'The focus is on decision quality, not on speed. A way in for those most affected exists before the decision is drafted, and the decider still decides.',
	skills: 'The focus is on tenure, not on people. A role is held for a stated term, and the term is what makes a better holder findable.',
	network: 'The focus is on the unit boundary, not on secrecy. What crosses it is decided in advance and written into the contract.',
};

/** The wrong reading of each principle. Rendered as a warn Callout under its practices. */
export const PRACTICE_CAVEAT: Record<AxisKey, { title: string; body: string }> = {
	decision: {
		title: 'Consultation is not a vote',
		body: 'All Affected guarantees a route in, not a veto. Averaging every position produces a decision nobody argued for, so the elected role still decides, and stands behind it: the alternatives weighed, the reason chosen, the objections not resolved.',
	},
	skills: {
		title: 'Competition is not turnover',
		body: 'Constant rotation has a real cost: everyone who depends on a role has to get used to a new person and new ways of working, and a promising change often underdelivers. So a mandate comes with a minimum stay: the holder cannot apply for another role until it is served. That length is the setting, longer for stability and shorter for change. The competition is continuous. The switch is not.',
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
			title: 'Every role has a second',
			body: 'Indispensability is something an organization builds, not a quality a person has. So every critical role is assigned a second: a vice who supports the work week to week and is trusted with calls of their own. Without one, the role cannot be put up for renomination, only defended. Competition for a role starts with there being someone to compete.',
			do: "Rotate the second holder in for a real cycle, and write the role's knowledge where the next holder could find it.",
			dont: 'Name a successor who has never made a decision the role owns.',
		},
		{
			title: 'Fixed mandates',
			body: 'Every role is held for a stated term with a stated end date. Founder is not a role: it is a fact about who started the company, it stays true for life, and no seat comes with it. A founder who is still the best CEO keeps the job by winning it again, a stronger claim on it than never having been asked. What ends is the mandate, not the relationship: there is a handover, and the outgoing holder is placed where their experience is now worth most.',
			do: "Publish each mandate's start, its end, and the criteria the next review will measure.",
			dont: 'Treat "nothing has gone wrong" as the case for renewal.',
		},
		{
			title: 'Open renomination',
			body: 'Before a mandate ends the role is opened, and the incumbent applies for it with a written plan like anyone else. The committee compares plans against published criteria, not candidates against the incumbent. Continuity is a legitimate result. It just has to win.',
			do: 'Decide after the applications are in, not before, and publish which criteria the winning plan met.',
			dont: 'Seat the incumbent, or the person who picked them, on the committee that decides the renewal.',
		},
	],
	network: [
		{
			title: 'Interface inventory',
			body: 'An interface is a place where a party can contribute without a prior relationship. It documents how to interact with it, names the role that owns it, states who may use it, and sets the terms. That covers code and APIs, and equally roles, teams, contracts, suppliers and subcontracting. Written down, the work belongs to the interface rather than to whoever happens to be doing it, so it can be measured and taken over by anyone who can meet it: a colleague, a supplier, a system. The inventory is the interfaces still unwritten, with an owner and a date against each line.',
			do: 'Document each interface as if for a stranger: how it is used, the role that owns it, who may call on it, and on what terms.',
			dont: 'Count an internal interaction as an interface: nothing is an interface until a party outside the unit asks for it.',
		},
		{
			title: 'Right of access',
			body: 'Every affected party, employee, partner, supplier or customer, has a named route to the records that bear on them: accounting, role criteria, subcontractor terms. Secrecy is justified by the harm it prevents, never by the scrutiny it avoids.',
			do: 'Put the request route in the interface terms, and make every refusal name the harm that outweighs the stake of the party asking.',
			dont: 'Mark a record confidential once and let the label answer every party who asks after. Answer anywhere but the interface and there is no route, only a person.',
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
