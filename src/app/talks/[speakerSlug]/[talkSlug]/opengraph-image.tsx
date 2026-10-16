import { notFound } from 'next/navigation';

import { getTalkBySlug } from '@/features/talks/queries/get-talk-by-slug';
import { shareImage, sharePropsForTalk } from '@/lib/og/share-image';

export { alt, contentType, size } from '@/lib/og/share-image';

interface TalkShareImageProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

export default async function Image({ params }: TalkShareImageProps) {
  const { speakerSlug, talkSlug } = await params;
  const talkResult = await getTalkBySlug(speakerSlug, talkSlug);

  if (!talkResult) {
    notFound();
  }

  const { speaker, talk } = talkResult;

  return shareImage(
    sharePropsForTalk({
      speaker,
      title: talk.title,
    })
  );
}
