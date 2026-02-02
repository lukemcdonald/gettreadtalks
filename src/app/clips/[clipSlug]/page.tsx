import { notFound } from 'next/navigation';

import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getClipBySlug } from '@/features/clips/queries/get-clip-by-slug';
import { ClipContent } from './_components/clip-content';
import { ClipSidebar } from './_components/clip-sidebar';

interface ClipPageProps {
  params: Promise<{ clipSlug: string }>;
}

export default async function ClipPage({ params }: ClipPageProps) {
  const { clipSlug } = await params;
  const data = await getClipBySlug(clipSlug);

  if (!data) {
    notFound();
  }

  const { clip, speaker, talk } = data;

  return (
    <SidebarLayout
      content={<ClipContent clip={clip} />}
      header={<PageHeader title={clip.title} />}
      sidebar={<ClipSidebar speaker={speaker} talk={talk} />}
    />
  );
}
