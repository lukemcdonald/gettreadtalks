import * as Sentry from "@sentry/nextjs";

Sentry.init({
  debug: process.env.NODE_ENV === "development",
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
  tracesSampleRate: 1.0,
});
