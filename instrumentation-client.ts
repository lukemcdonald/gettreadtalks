import { IS_SENTRY_ENABLED } from '@/configs/sentry';
import { getClientSentry, startClientSentry } from '@/configs/sentry/client';

if (IS_SENTRY_ENABLED) {
  startClientSentry();
}

export function onRouterTransitionStart(
  url: string,
  navigationType: string
): void {
  getClientSentry()?.captureRouterTransitionStart(url, navigationType);
}
