import { Suspense } from 'react';

import { preloadQuery } from 'convex/nextjs';
import { cookies } from 'next/headers';

import MainLayout from '@/components/layout/main-layout';
import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

import { HomeContent } from './_components/home-content';

async function HomeData() {
  // Access cookies first to mark this as a dynamic route
  // This is required in Next.js 16 before using better-auth (which uses Math.random internally)
  await cookies();

  // Preload talks data for server-side rendering
  const authToken = await getAuthToken();
  const preloadedTalks = await preloadQuery(
    api.talks.list,
    { paginationOpts: { numItems: 12, cursor: null } },
    { token: authToken },
  );

  return <HomeContent preloadedTalks={preloadedTalks} />;
}

export default function Home() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <HomeData />
      </Suspense>
    </MainLayout>
  );
}
