import { MainLayout } from '@/components/main-layout';

type ClipPageProps = {
  params: Promise<{
    clip: string;
    speaker: string;
  }>;
};

export default async function ClipPage({ params }: ClipPageProps) {
  await params;

  return (
    <MainLayout>
      <h1>Clip</h1>
    </MainLayout>
  );
}
