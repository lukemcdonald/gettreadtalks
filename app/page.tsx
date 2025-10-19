import { preloadQuery } from 'convex/nextjs';

import MainLayout from '@/components/layout/main-layout';
import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

import { HomeContent } from './_components/home-content';

export default async function Home() {
  // Preload talks data for server-side rendering
  const authToken = await getAuthToken();
  const preloadedTalks = await preloadQuery(
    api.talks.list,
    { paginationOpts: { numItems: 12, cursor: null } },
    { token: authToken },
  );

  return (
    <MainLayout>
      <HomeContent preloadedTalks={preloadedTalks} />
    </MainLayout>
  );
}
