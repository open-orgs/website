import { applyD1Migrations, type D1Migration } from 'cloudflare:test';
import { env } from 'cloudflare:workers';
import { beforeEach } from 'vitest';

// The migrations array is handed in as a binding by vitest.config.mts.
declare global {
	namespace Cloudflare {
		interface Env {
			TEST_MIGRATIONS: D1Migration[];
		}
	}
}

await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);

// The pool gives each test file its own worker, but not each test its own storage. Without this,
// every test would see whatever rows the tests before it wrote and the suite would only pass in
// one order.
beforeEach(async () => {
	await env.DB.prepare('DELETE FROM signatories').run();
});
