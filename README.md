# TREAD Talks

Faith-based talks platform. Next.js app with a Convex backend.

[Site Documentation](https://www.cubic.dev/wikis/lukemcdonald/gettreadtalks?page=ui-components)

## Stack

- **App:** [Next.js](https://nextjs.org/docs) 16, [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/docs) v4
- **UI:** [Coss UI](https://coss.com/ui) ([Base UI](https://base-ui.com/))
- **Backend:** [Convex](https://docs.convex.dev/)
- **Transcripts:** [youtube-transcript.io](https://www.youtube-transcript.io/)
- **Auth:** [Better Auth](https://better-auth.com/) (+ [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/))
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Email:** [Resend](https://resend.com/docs) + [React Email](https://react.email/)
- **Analytics:** [Vercel Analytics](https://vercel.com/docs/analytics) + [Segment](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/)
- **Errors:** [Sentry](https://docs.sentry.io/)
- **Lint/format:** [Oxlint](https://oxc.rs/docs/guide/usage/linter) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) ([Ultracite](https://www.ultracite.ai/docs/provider/oxlint))
- **Deploy:** [Vercel](https://vercel.com/docs)

## Setup

**Needs:** Node.js 24+ (see `.nvmrc`), pnpm 11+

1. Clone and install:

```bash
 pnpm install
```

2. Copy `.env.example` to `.env.local` and fill in values. Convex, auth, email, Turnstile, Segment, and Sentry keys are documented there.
3. Start local development:

```bash
 pnpm dev
```

Runs Next.js (HTTPS on `https://localhost:3000`) and Convex in parallel. On macOS it also opens the browser.

### Useful scripts

| Script           | What it does                       |
| ---------------- | ---------------------------------- |
| `pnpm style`     | Lint + format fix                  |
| `pnpm typecheck` | TypeScript check                   |
| `pnpm test`      | Vitest (`*.test.ts`, `*.test.tsx`) |
| `pnpm test:e2e`  | Playwright (`e2e/*.spec.ts`)       |
| `pnpm build`     | Production Next.js build           |
| `pnpm release`   | Manual Convex deploy (fallback)    |

### Deploy

Vercel production builds run `convex deploy --cmd 'pnpm build'` from `scripts/vercel-build.sh`, so Convex functions ship with the frontend. A failed Convex push fails the build.

Set `CONVEX_DEPLOY_KEY` in Vercel to the Convex **Production** Deploy Key (Production env only) and the Convex **Preview** Deploy Key (Preview env only). Same variable name, different values per environment — do not reuse one key for both. `pnpm release` remains a local fallback.
