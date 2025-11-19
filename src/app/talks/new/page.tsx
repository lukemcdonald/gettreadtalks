import { redirect } from 'next/navigation';

import { MainLayout } from '@/components/main-layout';
import { getAllCollections, getAllSpeakers } from '@/features/talks';
import { getCurrentUser } from '@/services/auth/server';
import { TalkForm } from './_components/talk-form';

export default async function NewTalkPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/talks/new');
  }

  const [collections, speakers] = await Promise.all([getAllCollections(), getAllSpeakers()]);

  return (
    <MainLayout>
      <h1 className="mb-6 font-semibold text-2xl">Create New Talk</h1>
      <TalkForm collections={collections} speakers={speakers} />
    </MainLayout>
  );
}
