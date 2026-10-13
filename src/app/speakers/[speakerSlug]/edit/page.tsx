import { notFound } from 'next/navigation';

import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';
import { redirectPublicEdit } from '@/lib/entities/redirect-public-edit';

interface PageProps {
  params: Promise<{ speakerSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { speakerSlug } = await params;
  const data = await getSpeakerBySlug(speakerSlug);

  if (!data) {
    notFound();
  }

  await redirectPublicEdit({
    entity: 'speakers',
    id: data.speaker._id,
    publicPath: `/speakers/${speakerSlug}`,
  });
}
