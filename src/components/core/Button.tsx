import type { Child } from 'hono/jsx';

/**
 * The one button. Primary is navy solid; everything else recedes.
 *
 * Hover, press and focus live in public/css/site.css as real pseudo-class rules — the design
 * system's prototype faked them with React state, which cannot work in server-rendered HTML.
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'quiet' | 'inverse' | 'link';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
	children?: Child;
	variant?: Variant;
	size?: Size;
	block?: boolean;
	disabled?: boolean;
	href?: string;
	type?: 'button' | 'submit' | 'reset';
	class?: string;
	id?: string;
	iconAfter?: Child;
	[key: string]: unknown;
}

export function Button({
	children,
	variant = 'primary',
	size = 'md',
	block,
	disabled,
	href,
	type = 'button',
	class: cls,
	iconAfter,
	...rest
}: ButtonProps) {
	const className = [
		'oo-button',
		`oo-button--${variant}`,
		`oo-button--${size}`,
		block ? 'oo-button--block' : '',
		cls,
	]
		.filter(Boolean)
		.join(' ');

	if (href) {
		return (
			<a href={href} class={className} {...rest}>
				{children}
				{iconAfter}
			</a>
		);
	}
	return (
		<button type={type} class={className} disabled={disabled} {...rest}>
			{children}
			{iconAfter}
		</button>
	);
}
