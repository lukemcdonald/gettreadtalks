import { DEPLOY_ENV } from '@/constants/env';

export function logAnalytics(action: string, payload?: unknown) {
  if (DEPLOY_ENV === 'prod') {
    return;
  }

  if (payload === undefined) {
    console.log(`[analytics]: ${action}`);

    return;
  }

  console.log(`[analytics]: ${action}`, payload);
}
