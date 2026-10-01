import { LOG_ANALYTICS_TO_CONSOLE } from '@/constants/env';

export function logAnalytics(action: string, payload?: unknown) {
  if (!LOG_ANALYTICS_TO_CONSOLE) {
    return;
  }

  if (payload === undefined) {
    console.log(`[analytics]: ${action}`);

    return;
  }

  console.log(`[analytics]: ${action}`, payload);
}
