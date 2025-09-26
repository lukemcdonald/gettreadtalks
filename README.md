# TREADTalks - Next.js + Convex + Better Auth

A modern, full-stack faith-based talks and content platform built with Next.js, Convex, and Better Auth.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Database/Backend**: Convex (serverless functions + database)
- **Authentication**: Better Auth (email/password)
- **Validation**: Zod
- **Observability**: Sentry
- **Package Manager**: pnpm
- **Node**: >= 20

## 🏁 Quick Start

### 1. Environment Setup

Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

**Required Variables:**

- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_SITE_URL` - Your site URL (http://localhost:3000 for dev)

**Optional Variables:**

- `NEXT_PUBLIC_SENTRY_DSN` - For error monitoring
- `BETTER_AUTH_EMAIL_FROM` - For email notifications
- `RESEND_API_KEY` - For email sending

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development

```bash
# Start both Next.js and Convex (recommended)
pnpm dev

# Or start individually
pnpm dev:next    # Next.js only
pnpm convex:dev  # Convex only
```

### 4. Visit Your App

Open [http://localhost:3000](http://localhost:3000) to see the environment validation and setup status.

## 🗄️ Database Schema

The database schema is designed around content management with these main entities:

- **Users**: Authentication and user profiles
- **Speakers**: Content creators and speakers
- **Collections**: Grouped content (formerly series)
- **Topics**: Content categorization
- **Talks**: Main long-form content
- **Clips**: Short-form content snippets
- **User Interactions**: Favorites, bookmarks, follows

See `/.notes/bootstrap/treadtalks-schema.dbml` for the complete relational schema and `/.notes/bootstrap/treadtalks-convex-mapping.md` for Convex implementation details.

## 🔐 Authentication

Built-in authentication flows include:

- **Email/Password Registration**
- **Login/Logout**
- **Protected Routes** (`/account` requires auth)
- **Session Management**

### Protected Routes

- `/account` - User dashboard (requires authentication)
- `/login` - Public login/registration page

## 📁 Project Structure

```
├── convex/                 # Convex backend functions and schema
│   ├── schema.ts          # Database schema definition
│   ├── talks.ts           # Talk-related queries/mutations
│   └── _generated/        # Auto-generated Convex API
├── lib/                   # Utility libraries
│   ├── auth.ts            # Better Auth server config
│   ├── auth-client.ts     # Better Auth client config
│   ├── convex.ts          # Convex client setup
│   └── env-validation.ts  # Environment validation utilities
├── components/            # React components
│   ├── providers.tsx      # Context providers
│   └── env-status.tsx     # Environment status component
└── src/app/              # Next.js app router
    ├── api/auth/         # Authentication API routes
    ├── login/            # Login page
    ├── account/          # Protected user dashboard
    └── layout.tsx        # Root layout with providers
```

## 🛠️ Available Scripts

- `pnpm dev` - Start both Next.js and Convex development servers
- `pnpm dev:next` - Start only Next.js development server
- `pnpm convex:dev` - Start only Convex development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm convex:deploy` - Deploy Convex functions

## 🌍 Environment Variables

All environment variables are documented in `.env.example`. The app includes:

- **Environment validation** on startup
- **Graceful degradation** when optional services aren't configured
- **Clear error messages** for missing required variables

## 🔒 Security Features

- **Content Security Policy** headers configured
- **Bot protection** integration ready (Vercel Bot Protection)
- **Session management** with secure cookies
- **Input validation** with Zod schemas

## 📊 Observability

- **Sentry integration** for error monitoring
- **Environment-based configuration**
- **Development vs production** distinction
- **Performance monitoring** ready

## 🚢 Deployment

The app is configured for deployment on Vercel with:

- **Automatic deployments** from Git
- **Environment variable** management through Vercel dashboard
- **Preview deployments** for branches
- **Production optimizations**

## 📝 Notes

- **Minimal UI**: Prioritizes functionality over styling (as requested)
- **Environment validation**: Fails early with clear error messages
- **Extensible schema**: Ready for the full DBML schema implementation
- **MVP-focused**: Core features implemented, extensible for future needs

## 🔗 Resources

- [Better Auth Documentation](https://better-auth.com/)
- [Convex Documentation](https://docs.convex.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
