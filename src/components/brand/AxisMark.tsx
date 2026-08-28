import type { AxisKey } from '../../content/axes';

/**
 * The per-principle structural mark. One vocabulary, three constraints:
 * converge / substitute / connect out.
 *
 * Geometry is fixed — hub r 4, satellites r 2.6, every spoke 22.0, left/right node span 22.0.
 * Do not nudge these numbers.
 */
const GEO: Record<
	AxisKey,
	{
		nodes: [number, number][];
		edges: [number, number][];
		hub: number;
		dashed?: number[];
		arms?: [number, number, number, number][];
	}
> = {
	decision: {
		nodes: [
			[8, 12],
			[8, 30],
			[8, 48],
			[30, 30],
		],
		edges: [
			[0, 3],
			[1, 3],
			[2, 3],
		],
		hub: 3,
	},
	skills: {
		nodes: [
			[8, 12],
			[8, 30],
			[8, 48],
			[30, 30],
			[30, 12],
		],
		edges: [
			[0, 3],
			[1, 3],
			[2, 3],
			[0, 4],
		],
		hub: 3,
		dashed: [3],
	},
	network: {
		nodes: [
			[13, 10.95],
			[35, 10.95],
			[13, 49.05],
			[35, 49.05],
			[24, 30],
		],
		edges: [
			[0, 4],
			[1, 4],
			[2, 4],
			[3, 4],
		],
		hub: 4,
		arms: [
			[10, 30, -3, 30],
			[38, 30, 51, 30],
		],
	},
};

interface AxisMarkProps {
	axis: AxisKey;
	size?: number;
	active?: boolean;
	tone?: 'default' | 'inverse';
	class?: string;
}

export function AxisMark({ axis, size = 56, active, tone = 'default', class: cls }: AxisMarkProps) {
	const g = GEO[axis];
	const inverse = tone === 'inverse';
	const color = inverse ? 'var(--navy-200)' : `var(--axis-${axis})`;
	const edge = active ? color : inverse ? 'var(--navy-400)' : 'var(--navy-300)';
	const hub = active ? color : inverse ? 'var(--navy-200)' : 'var(--navy-700)';
	const satFill = inverse ? 'var(--navy-900)' : 'var(--grey-0)';
	const satStroke = active ? color : inverse ? 'var(--navy-300)' : 'var(--navy-400)';

	return (
		<svg
			viewBox="0 0 48 60"
			width={size}
			height={(size / 48) * 60}
			aria-hidden="true"
			class={['oo-axis-mark', cls].filter(Boolean).join(' ')}
		>
			<g stroke={edge} stroke-width="1" stroke-linecap="round" fill="none">
				{g.edges.map(([a, b], i) => (
					<line
						x1={g.nodes[a][0]}
						y1={g.nodes[a][1]}
						x2={g.nodes[b][0]}
						y2={g.nodes[b][1]}
						stroke-dasharray={g.dashed && g.dashed.includes(b) && i === g.edges.length - 1 ? '2 3' : undefined}
					/>
				))}
			</g>
			{g.arms && (
				<g stroke={edge} stroke-width="1" stroke-dasharray="2 3" stroke-linecap="round">
					{g.arms.map(([x1, y1, x2, y2]) => (
						<line x1={x1} y1={y1} x2={x2} y2={y2} />
					))}
				</g>
			)}
			{g.nodes.map(([x, y], i) => (
				<circle
					cx={x}
					cy={y}
					r={i === g.hub ? 4 : 2.6}
					fill={i === g.hub ? hub : satFill}
					stroke={i === g.hub ? 'none' : satStroke}
					stroke-width="1"
				/>
			))}
		</svg>
	);
}
