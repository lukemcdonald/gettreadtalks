import { notFound } from 'next/navigation';

import { getClipBySlug } from '@/features/clips/queries/get-clip-by-slug';
import { shareImage, sharePropsForClip } from '@/lib/og/share-image';

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

  return shareImage(
    sharePropsForClip({
      speaker,
      title: clip.title,
    })
  );
}
