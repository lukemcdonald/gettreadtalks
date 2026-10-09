# End-to-end tests

Playwright runs Chromium only, against the PR preview in CI or `PLAYWRIGHT_BASE_URL` locally.

```sh
PLAYWRIGHT_BASE_URL=https://www.gettreadtalks.com pnpm test:e2e
```

## Locator rule

- **Actions / CTAs** (buttons and links the user clicks): `data-testid`, kebab-case (`hero-primary`, `nav-talks`, `talk-card`). Survives copy, i18n, and experiment changes. Playwright's default `testIdAttribute` (`data-testid`).
- **Structure and content** (headings, search, 404, playback): `getByRole` / text.
- Web-first assertions only. No manual waits.

Page objects live in `pages/` and are injected with `test.extend` fixtures. Specs import `test` from `fixtures/` and do not construct page objects.
