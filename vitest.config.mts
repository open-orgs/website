import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Read on the Node side and handed to the test worker as a binding — the setup file applies
// them, so tests run against the same schema as production rather than a hand-written copy.
const migrations = await readD1Migrations(path.join(import.meta.dirname, 'migrations'));

export default defineConfig({
	plugins: [
		cloudflareTest({
			// wrangler.jsonc marks the `send_email` binding `remote: true` so that `wrangler dev`
			// reaches the real Email Sending service. The pool honours that by default, which opens
			// an authenticated connection to the account on every test run — it needs credentials,
			// needs the network, and costs seconds of startup. Tests stub the binding, so turn it
			// off and keep the suite fully local.
			remoteBindings: false,
			wrangler: { configPath: './wrangler.jsonc' },
			miniflare: {
				bindings: {
					TEST_MIGRATIONS: migrations,
					// Fixed values, so a run never depends on whichever .dev.vars happens to be on
					// disk and no real secret is loaded into the test isolate. Turnstile's published
					// always-pass key pair; siteverify is stubbed out in the suite regardless.
					SENDER_EMAIL: 'hello@openorgs.test',
					ADMIN_EMAIL: 'admin@openorgs.test',
					TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
					TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
				},
			},
		}),
	],
	test: {
		include: ['test/**/*.spec.ts'],
		setupFiles: ['./test/setup.ts'],
		coverage: {
			// v8 coverage cannot instrument code running inside workerd — istanbul is the only
			// provider the Workers pool supports.
			provider: 'istanbul',
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			reporter: ['text', 'html'],
		},
	},
});
