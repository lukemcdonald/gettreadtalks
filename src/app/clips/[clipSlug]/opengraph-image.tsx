import { notFound } from 'next/navigation';

import { loadClipBySlug } from '@/features/clips/queries/load-clip-by-slug';
import { shareImage, sharePropsForClip } from '@/lib/og/share-image';

export { alt, contentType, size } from '@/lib/og/share-image';

interface ClipShareImageProps {
  params: Promise<{ clipSlug: string }>;
}

export default async function Image({ params }: ClipShareImageProps) {
  const { clipSlug } = await params;
  const data = await loadClipBySlug(clipSlug);

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
