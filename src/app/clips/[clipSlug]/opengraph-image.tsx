import { notFound } from 'next/navigation';

import { getClipBySlug } from '@/features/clips/queries/get-clip-by-slug';
import { getSpeakerName } from '@/features/speakers/utils';
import { shareImage, toShareSpeaker } from '@/lib/og/share-image';

export { alt, contentType, size } from '@/lib/og/share-image';

interface ClipShareImageProps {
  params: Promise<{ clipSlug: string }>;
}

export default async function Image({ params }: ClipShareImageProps) {
  const { clipSlug } = await params;
  const data = await getClipBySlug(clipSlug);

  if (!data) {
    notFound();
  }

  const { clip, speaker } = data;

  if (!speaker) {
    return shareImage({ title: clip.title });
  }

  return shareImage({
    speaker: toShareSpeaker({
      imageUrl: speaker.imageUrl,
      ministry: speaker.ministry,
      name: getSpeakerName(speaker),
      role: speaker.role,
    }),
    title: clip.title,
  });
}
