# End-to-end tests

Playwright runs Chromium only, against the PR preview in CI or `PLAYWRIGHT_BASE_URL` locally.

```sh
PLAYWRIGHT_BASE_URL=https://www.gettreadtalks.com pnpm test:e2e
```

## Projects

- `chromium` — public catalog and auth UI tests (empty storage state)
- `setup` — `auth.setup.ts` signs in through the UI and writes `playwright/.auth/user.json` (gitignored)
- `chromium-user` — signed-in flows that reuse that `storageState`

`setup` and `chromium-user` are registered only when `E2E_USER_EMAIL` and `E2E_USER_PASSWORD` are set (the preview seeded user). Auth UI tests skip with a message when those env vars are missing, so local runs stay green. Do not log the values. Traces stay off when they or `VERCEL_AUTOMATION_BYPASS_SECRET` are set.

Protected previews also need `VERCEL_AUTOMATION_BYPASS_SECRET`.

```sh
E2E_USER_EMAIL=you@example.com E2E_USER_PASSWORD=secret PLAYWRIGHT_BASE_URL=https://preview.example VERCEL_AUTOMATION_BYPASS_SECRET=bypass pnpm test:e2e
```

## Locator rule

- **Actions / CTAs** (buttons and links the user clicks): `data-testid`, kebab-case (`hero-primary`, `nav-talks`, `talk-card`, `sign-in`, `sign-out`). Survives copy, i18n, and experiment changes. Playwright's default `testIdAttribute` (`data-testid`). Intersect with `getByRole('link')` when the control is inside a `content-visibility: auto` card so the click targets a visible node.
- **Structure and content** (headings, search, 404, playback): `getByRole` / text.
- Web-first assertions only. No manual waits.

Page objects live in `pages/` and are injected with `test.extend` fixtures. Specs import `test` from `fixtures/` and do not construct page objects.
