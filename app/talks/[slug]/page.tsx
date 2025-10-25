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
  await cookies();
  const { slug } = await params;
  const authToken = await getAuthToken();
  const talkData = await fetchQuery(api.talks.getTalkBySlug, { slug }, { token: authToken });

  if (!talkData) {
    notFound();
  }

  return <TalkPageContent talkData={talkData} />;
}

export default async function TalkPage({ params }: TalkPageProps) {
  return <TalkPageData params={params} />;
}
