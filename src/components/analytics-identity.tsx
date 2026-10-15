import { navigation } from 'next/cache';

import { AnalyticsIdentifyUser } from '@/components/analytics-provider';
import { getCurrentUser } from '@/services/auth/server';

export async function AnalyticsIdentity() {
  await navigation();
  const user = await getCurrentUser();

  return <AnalyticsIdentifyUser user={user} />;
}
