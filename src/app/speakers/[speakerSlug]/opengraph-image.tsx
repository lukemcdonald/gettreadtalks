import { notFound } from 'next/navigation';

import { getSpeakerBySlug } from '@/features/speakers/queries/get-speaker-by-slug';
import { shareImage, sharePropsForSpeaker } from '@/lib/og/share-image';

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

  return shareImage(sharePropsForSpeaker(data.speaker));
}
