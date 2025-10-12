import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Debug mode for troubleshooting Sentry itself (set NEXT_PUBLIC_SENTRY_DEBUG=true)
  debug: process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true',

  // Data Source Name - unique identifier for your Sentry project
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment helps filter errors in Sentry dashboard
  environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',

  // Integrations enhance error tracking
  integrations: [
    // Browser tracing for performance monitoring
    Sentry.browserTracingIntegration({
      // Track navigation and user interactions
      enableInp: true,
    }),
    // Replay user sessions when errors occur
    Sentry.replayIntegration({
      // Mask all text content for privacy
      maskAllText: true,
      // Block all media (images, video, audio)
      blockAllMedia: true,
    }),
  ],

  // Performance Monitoring
  // Capture 100% of transactions in development, 10% in production
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Session Replay - skipped for now per user request
  // When enabled, set replaysOnErrorSampleRate to 1.0 and replaysSessionSampleRate to 0.1

  // Before sending events to Sentry, you can modify or drop them
  beforeSend(event, hint) {
    // Don't send errors in development (we'll see them in console)
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Error (not sent in dev):', hint.originalException || hint.syntheticException);
      return null;
    }

    return event;
  },
});
