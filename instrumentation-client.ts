import { IS_SENTRY_ENABLED } from '@/configs/sentry';
import {
  getClientSentry,
  installClientSentryBuffer,
  scheduleClientSentryLoad,
} from '@/configs/sentry/load-client';

if (IS_SENTRY_ENABLED) {
  installClientSentryBuffer();
  scheduleClientSentryLoad();
}

export function onRouterTransitionStart(
  url: string,
  navigationType: string
): void {
  getClientSentry()?.captureRouterTransitionStart(url, navigationType);
}
