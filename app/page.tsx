import { preloadQuery } from 'convex/nextjs';

import MainLayout from '@/components/layout/main-layout';
import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

import { HomeContent } from './_components/home-content';

async function HomeData() {
  const authToken = await getAuthToken();
  const preloadedTalks = await preloadQuery(
    api.talks.listTalks,
    { paginationOpts: { numItems: 12, cursor: null } },
    { token: authToken },
  );

  return <HomeContent preloadedTalks={preloadedTalks} />;
}

export default function Home() {
  return (
    <MainLayout>
      <HomeData />
    </MainLayout>
  );
}
