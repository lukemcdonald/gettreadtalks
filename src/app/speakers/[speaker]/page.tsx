import { notFound } from 'next/navigation';

import { SpeakerContent } from '@/app/speakers/[speaker]/_components/speaker-content';
import { SpeakerLeftSidebar } from '@/app/speakers/[speaker]/_components/speaker-sidebar-left';
import { SpeakerRightSidebar } from '@/app/speakers/[speaker]/_components/speaker-sidebar-right';
import { SidebarsLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getSpeakerBySlug, getSpeakerName } from '@/features/speakers';

type SpeakerPageProps = {
  params: Promise<{ speaker: string }>;
};

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { speaker: slug } = await params;
  const data = await getSpeakerBySlug(slug);

  if (!data) {
    notFound();
  }

  const { clips, collections, speaker, talks } = data;

  return (
    <SidebarsLayout
      content={
        <SpeakerContent clips={clips} collections={collections} speaker={speaker} talks={talks} />
      }
      header={<PageHeader title={getSpeakerName(speaker)} />}
      leftSidebar={
        <SpeakerLeftSidebar
          clips={clips}
          collections={collections}
          speaker={speaker}
          talks={talks}
        />
      }
      rightSidebar={<SpeakerRightSidebar />}
    />
  );
}
