import { MainLayout } from '@/components/main-layout';

interface SpeakerPageProps {
  params: Promise<{
    speaker: string;
  }>;
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  await params;

  return (
    <MainLayout>
      <h1>Speaker</h1>
    </MainLayout>
  );
}
