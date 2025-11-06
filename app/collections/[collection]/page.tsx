import { MainLayout } from '@/components/main-layout';

interface CollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  await params;

  return (
    <MainLayout>
      <h1>Collection</h1>
    </MainLayout>
  );
}
