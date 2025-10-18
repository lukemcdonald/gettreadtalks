// This file initializes Sentry on the client side.
// It runs before your application becomes interactive.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { IS_SENTRY_ENABLED } from './lib/config/sentry';

if (IS_SENTRY_ENABLED) {
  import('./lib/config/sentry/client');
}
