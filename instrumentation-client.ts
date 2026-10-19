import { IS_SENTRY_ENABLED } from '@/configs/sentry';
import { startClientSentry } from '@/configs/sentry/client';

if (IS_SENTRY_ENABLED) {
  startClientSentry();
}
