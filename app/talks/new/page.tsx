import { redirect } from 'next/navigation';

import { MainLayout } from '@/components/main-layout';
import { getAllCollections, getAllSpeakers } from '@/lib/features/talks';
import { getCurrentUser } from '@/lib/services/auth/server';

import { TalkForm } from './_components';

export default async function NewTalkPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/talks/new');
  }

  const [collections, speakers] = await Promise.all([getAllCollections(), getAllSpeakers()]);

  return (
    <MainLayout>
      <h1 className="mb-6 font-bold text-2xl">Create New Talk</h1>
      <TalkForm collections={collections} speakers={speakers} />
    </MainLayout>
  );
}
