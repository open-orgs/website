import type { Child } from 'hono/jsx';

/**
 * The document shell. Token CSS and the JS islands are plain static assets under public/, served
 * by Workers Assets before the Worker ever runs — no static middleware is involved.
 */
interface LayoutProps {
	title: string;
	description: string;
	children?: Child;
}

export function Layout({ title, description, children }: LayoutProps) {
	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:type" content="website" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
				<link rel="stylesheet" href="/css/tokens/fonts.css" />
				<link rel="stylesheet" href="/css/tokens/colors.css" />
				<link rel="stylesheet" href="/css/tokens/typography.css" />
				<link rel="stylesheet" href="/css/tokens/space.css" />
				<link rel="stylesheet" href="/css/tokens/elevation.css" />
				<link rel="stylesheet" href="/css/tokens/base.css" />
				<link rel="stylesheet" href="/css/site.css" />
				<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
				<script src="/js/optimum-field.js" defer />
				<script src="/js/toast.js" defer />
				<script src="/js/dialog.js" defer />
			</head>
			<body>{children}</body>
		</html>
	);
}
