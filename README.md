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

1. Create a JavaScript source in Segment and set `NEXT_PUBLIC_SEGMENT_WRITE_KEY` in `.env.local` and Vercel.
2. Add the Mixpanel Actions destination on that source. Store the Mixpanel project token in Segment, not in Next.js env.
3. Keep default mappings for Page, Identify, and Track.
4. Enable the destination and confirm events in Mixpanel Live View.
5. Use Mixpanel Actions (cloud-mode). Do not enable classic Mixpanel device-mode, and do not add a PostHog destination.

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
