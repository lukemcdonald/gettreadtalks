import { MainLayout } from '@/components/main-layout';

interface TopicPageProps {
  params: Promise<{
    topic: string;
  }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  await params;

  return (
    <MainLayout>
      <h1>Topic</h1>
    </MainLayout>
  );
}
