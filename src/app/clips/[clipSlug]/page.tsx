import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { PageBreadcrumb } from '@/components/ui';
import { getClipBySlug } from '@/features/clips/queries/get-clip-by-slug';
import { ClipContent } from './_components/clip-content';
import { ClipSidebar } from './_components/clip-sidebar';

interface ClipPageProps {
  params: Promise<{ clipSlug: string }>;
}

export async function generateMetadata({ params }: ClipPageProps): Promise<Metadata> {
  const { clipSlug } = await params;
  const data = await getClipBySlug(clipSlug);

  if (!data) {
    return {};
  }

  const { clip, speaker } = data;
  const speakerName = speaker ? `${speaker.firstName} ${speaker.lastName}` : '';

  return {
    description: clip.description ?? (speakerName ? `A clip from ${speakerName}.` : undefined),
    title: clip.title,
  };
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
      breadcrumb={
        <PageBreadcrumb segments={[{ href: '/clips', label: 'Clips' }, { label: clip.title }]} />
      }
      content={<ClipContent clip={clip} />}
      header={<PageHeader title={clip.title} />}
      sidebar={<ClipSidebar speaker={speaker} talk={talk} />}
    />
  );
}
