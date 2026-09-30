# TREAD Talks

A modern, full-stack faith-based talks and content platform built with Next.js, Convex, and Better Auth.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4
- **UI:** Coss UI (built on Base UI)
- **Backend:** Convex (database + backend functions)
- **Authentication:** Better Auth
- **Forms:** React Hook Form + Zod
- **Email:** Resend + React Email
- **Analytics:** Vercel Web Analytics (page traffic). Product events via Segment. Mixpanel is a Segment destination. Session replay is not used.
- **Error Monitoring:** Sentry
- **Linting/Formatting:** Oxlint + Oxfmt (Ultracite)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 22+ (LTS recommended)
- pnpm

### Development

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your values
4. Start the development server:

   ```bash
   pnpm dev
   ```

   This runs both Next.js and Convex dev in parallel.

### Product analytics (Segment and Mixpanel)

Use two Segment JavaScript sources (dev and prod), each with its own write key.

1. Set `NEXT_PUBLIC_SEGMENT_WRITE_KEY` to the matching source key in `.env.local` (dev) and Vercel (prod).
2. Create two Mixpanel projects (dev and prod). Copy each project token from Mixpanel Project Settings.
3. In Segment, add a Mixpanel Actions destination to each JS source. Paste the matching Mixpanel project token into the destination. Do not put a Mixpanel token in Next.js env.
4. Keep default mappings for Page, Identify, and Track. Use cloud-mode (Actions). Do not enable classic Mixpanel device-mode.
5. Enable each destination. Confirm in Segment Debugger, then Mixpanel Live View. Do not add a PostHog destination.

## Resources

- [Base UI Documentation](https://base-ui.com/)
- [Better Auth Documentation](https://better-auth.com/)
- [Oxlint Documentation](https://oxc.rs/docs/guide/usage/linter)
- [Ultracite Documentation](https://www.ultracite.ai/docs/provider/oxlint)
- [Convex Documentation](https://docs.convex.dev/)
- [Coss UI Documentation](https://coss.com/ui)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Web Analytics](https://vercel.com/docs/analytics)
- [React Email Documentation](https://react.email/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Resend Documentation](https://resend.com/docs)
- [Segment Analytics.js](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)
