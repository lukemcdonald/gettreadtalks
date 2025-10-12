import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Only enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Data Source Name - unique identifier for your Sentry project
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment helps filter errors in Sentry dashboard
  environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',

  // Performance Monitoring
  // Capture 100% of transactions in development, 10% in production
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Before sending events to Sentry, you can modify or drop them
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Error (not sent in dev):', hint.originalException || hint.syntheticException);
      return null;
    }

    return event;
  },
});
