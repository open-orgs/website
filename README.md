# Open Orgs website

The movement site: the three principles, and the two things a visitor can do about them — sign the
principles, or request a consultation call.

Cloudflare Worker, Hono with server-rendered JSX. No client framework: the page ships as HTML, with
three small vanilla-JS islands for the background field, the form dialogs, and the toast.

## Layout

```
src/
  index.ts              Hono app, mounts the routes
  routes/               pages.tsx (GET /), sign.ts, consultation.ts
  layout/ pages/ sections/   the page
  components/           brand · core · forms · navigation · feedback
  forms/                the two dialog forms
  content/axes.ts       the three principles — the only source of truth for them
  lib/                  db · email · turnstile · validate
public/
  css/tokens/           design-system tokens, copied from the skill
  css/site.css          component layer
  js/                   optimum-field · dialog · toast
migrations/             D1 schema
```

Everything visual comes from the `open-orgs-design` skill in `.claude/skills/`. Its `readme.md` is the
authority on voice and visual rules — read it before changing copy. Two rules bite most often:
the three principle names and their order are fixed and exact, and **a number without a source line does
not ship**.

## What is stored

Signatories go into D1 (`signatories`, `status` defaults to `pending`). **Consultation requests are not
stored at all** — they are emailed to `ADMIN_EMAIL` and followed up from the inbox. That is why the two
routes handle mail failure differently: a failed send on `/api/sign` is logged and swallowed, because the
row is the record; a failed admin send on `/api/consultation` returns 500, because there is no record.

## Configuration

Public values live in `wrangler.jsonc` under `vars` (`SENDER_EMAIL`, `TURNSTILE_SITE_KEY`). Secrets
(`ADMIN_EMAIL`, `TURNSTILE_SECRET_KEY`) live in `.env` / `.dev.vars`, both gitignored — copy the
`.example` files.

| Resource | Value |
| --- | --- |
| D1 database | `openorgs-website-db` |
| Turnstile widget | `openorgs-website`, mode `managed`, domains `openorgs.org` + `www.openorgs.org` |
| Email Sending | `openorgs.org` (already onboarded — check with `wrangler email sending list`) |
| Custom domain | `openorgs.org` |

### Getting the Turnstile keys

Local work needs none of this: `.dev.vars.example` ships Turnstile's published always-pass test keys,
so `npm run dev` clears verification without a real widget. This is for a fresh account, or for
whoever is standing the site up somewhere new.

Create the widget from the CLI:

```sh
npx wrangler turnstile widget create openorgs-website \
  --mode managed \
  --domain openorgs.org --domain www.openorgs.org
```

or in the dashboard: **Turnstile → Add widget**, name `openorgs-website`, hostnames `openorgs.org`
and `www.openorgs.org`, widget mode **Managed**. Creating it prints both keys — and they look alike,
both starting `0x4AAAAAAA…`, so keep track of which is which:

| Key | Secret? | Goes in |
| --- | --- | --- |
| Site key | no — it ships in the page HTML | `wrangler.jsonc` → `vars.TURNSTILE_SITE_KEY` |
| Secret key | yes | `.env` → `TURNSTILE_SECRET_KEY`, uploaded by `npx wrangler deploy --secrets-file .env` |

The secret is shown once at creation. After that, read it from the widget's settings in the dashboard,
or rotate it there. `npx wrangler turnstile widget list` recovers the site key of a widget that
already exists.

The CLI needs credentials with `Account.Turnstile:Edit`; `wrangler login`'s OAuth scopes do not always
include it. If the create call comes back with a permission error, either use the dashboard or export
a `CLOUDFLARE_API_TOKEN` with that permission.

Do not add `localhost` to the widget's hostnames. `verifyTurnstile` in [src/lib/turnstile.ts](src/lib/turnstile.ts)
does not pin the `hostname` that siteverify returns, so a hostname on the widget is a hostname anyone
can mint a passing token from — the test keys are what covers local dev.

Both forms share the one widget. The per-form `action` (`sign`, `consultation`) is set on the embed,
in [src/components/feedback/Dialog.tsx](src/components/feedback/Dialog.tsx), and asserted server-side
in `verifyTurnstile`, so a token minted for one form is rejected by the other route. None of it is
configured on the widget.

## Commands

```sh
npm run dev                    # local, at http://localhost:8787
npm test                       # one run, in the Workers runtime, then exit
npm run test:coverage          # istanbul coverage over src/
npm run typecheck              # tsc over src and over the suite
npm run check                  # typecheck + test — what CI runs
npm run cf-typegen             # regenerate Env types after any binding change

npx wrangler d1 migrations apply openorgs-website-db --local
npx wrangler d1 migrations apply openorgs-website-db --remote

npx wrangler deploy --secrets-file .env
```

`.dev.vars` uses Turnstile's published always-pass test keys, so local submissions clear verification
without a real challenge. Email has no local emulation — the `send_email` binding is `remote: true`, so
sends from `wrangler dev` hit the real service and reach real inboxes.

## Tests

`test/index.spec.ts` drives the Worker inside workerd via `@cloudflare/vitest-plugin`, against a
real local D1 with `migrations/` applied — so the schema under test is the schema that ships.

The run is hermetic and offline. `vitest.config.mts` sets `remoteBindings: false` (without it the
`remote: true` on `send_email` opens an authenticated connection to the account on every run) and
pins `ADMIN_EMAIL`, `SENDER_EMAIL` and the Turnstile keys to fixed test values, so no real secret
reaches the test isolate whatever is in `.dev.vars`. A test asserts that pinning still holds.
Wrangler still prints `Using secrets defined in .dev.vars` on startup; those values are overridden.

Two seams are stubbed: `EMAIL` (no local emulation exists) and the outbound Turnstile siteverify
`fetch`. Everything else is the real code path. `test/setup.ts` empties `signatories` before each
test, so the suite is order-independent. Routes that log a failed send have that log captured and
asserted rather than printed — stderr on a green run should be empty.

## After deploying

```sh
npx wrangler email sending dns get openorgs.org        # SPF/DKIM present
npx wrangler d1 execute openorgs-website-db --remote --command "select * from signatories"
```
