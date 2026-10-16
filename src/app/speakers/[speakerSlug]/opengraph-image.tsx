import { notFound } from 'next/navigation';

import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';
import { getSpeakerName } from '@/features/speakers/utils';
import { shareImage, toShareSpeaker } from '@/lib/og/share-image';

export { alt, contentType, size } from '@/lib/og/share-image';

interface SpeakerShareImageProps {
  params: Promise<{ speakerSlug: string }>;
}

export default async function Image({ params }: SpeakerShareImageProps) {
  const { speakerSlug } = await params;
  const data = await getSpeakerBySlug(speakerSlug);

  if (!data) {
    notFound();
  }

  const { speaker } = data;
  const name = getSpeakerName(speaker);

  return shareImage({
    speaker: toShareSpeaker({
      imageUrl: speaker.imageUrl,
      ministry: speaker.ministry,
      name,
      role: speaker.role,
    }),
    speakerPlacement: 'title',
    title: name,
  });
}
