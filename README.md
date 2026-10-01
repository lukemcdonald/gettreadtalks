# TREAD Talks

Faith-based talks platform. Next.js app with a Convex backend.

## Stack

- **App:** [Next.js](https://nextjs.org/docs) 16, [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/docs) v4
- **UI:** [Coss UI](https://coss.com/ui) ([Base UI](https://base-ui.com/))
- **Backend:** [Convex](https://docs.convex.dev/)
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

   Runs Next.js (HTTPS on `https://localhost:3000`) and Convex in parallel, then opens the browser.

### Useful scripts

| Script           | What it does             |
| ---------------- | ------------------------ |
| `pnpm style`     | Lint + format fix        |
| `pnpm typecheck` | TypeScript check         |
| `pnpm build`     | Production Next.js build |
| `pnpm release`   | Deploy Convex            |
