# TREAD Talks

A modern, full-stack faith-based talks and content platform built with Next.js, Convex, and Better Auth.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS v4
- **Backend:** Convex (database + backend functions)
- **Authentication:** Better Auth
- **Email:** Resend
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
3. Set up environment variables (see Environment Variables section)
4. Start the development server:
   ```bash
   pnpm dev
   ```
   This runs both Next.js and Convex dev in parallel.

## Deployment

Deployment is fully automated via Vercel:
- Push to `main` → Vercel automatically deploys Convex functions + Next.js app
- Preview deployments created automatically for pull requests

### Build Process

```bash
pnpm run build
  → convex deploy --cmd 'pnpm run build:next'
    → 1. Deploys Convex functions to production
    → 2. Builds Next.js application
```

## Environment Variables

### Vercel

Required for automated deployment:
- `CONVEX_DEPLOY_KEY` - Get from Convex Dashboard → Settings → Deploy Keys

### Convex

Set in Convex Dashboard → Settings → Environment Variables:

**Authentication:**
- `BETTER_AUTH_SECRET` - Random secret key for Better Auth
- `SITE_URL` - Your production URL (e.g., `https://gettreadtalks.vercel.app`)

**Email (Resend):**
- `RESEND_API_KEY` - Get from Resend Dashboard
- `RESEND_TEST_EMAIL` - Your email for testing (development only)
- `RESEND_TEST_MODE` - Set to `false` for production
- `RESEND_WEBHOOK_SECRET` - Get from Resend Dashboard → Webhooks

## 🔗 Resources

- [Better Auth Documentation](https://better-auth.com/)
- [Convex Documentation](https://docs.convex.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
