import { MainLayout } from '@/components/main-layout';
import { preloadTalks } from '@/lib/features/talks';

import { TalksList } from './_components/talks-list';

export default async function HomePage() {
  const preloadedTalks = await preloadTalks();

  return (
    <MainLayout>
      <TalksList preloadedTalks={preloadedTalks} />
    </MainLayout>
  );
}
