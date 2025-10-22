import { Suspense } from 'react';

import { fetchQuery } from 'convex/nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

import { TalkPageContent } from './_components/talk-page-content';

interface TalkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function TalkPageData({ params }: { params: Promise<{ slug: string }> }) {
  // Access cookies first to mark this as a dynamic route
  // This is required in Next.js 16 before using better-auth
  await cookies();

  // Await params INSIDE Suspense boundary to avoid blocking entire page
  const { slug } = await params;

  const authToken = await getAuthToken();
  const talkData = await fetchQuery(api.talks.getBySlug, { slug }, { token: authToken });

  if (!talkData) {
    notFound();
  }

  return <TalkPageContent talkData={talkData} />;
}

export default async function TalkPage({ params }: TalkPageProps) {
  return (
    <Suspense fallback={<div className="p-8">Loading talk...</div>}>
      <TalkPageData params={params} />
    </Suspense>
  );
}
