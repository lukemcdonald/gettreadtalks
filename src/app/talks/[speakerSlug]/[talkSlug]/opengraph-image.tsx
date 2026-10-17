import { notFound } from 'next/navigation';

import { loadTalkBySlug } from '@/features/talks/queries/load-talk-by-slug';
import { shareImage, buildSharePropsForTalk } from '@/lib/og/share-image';

export { alt, contentType, size } from '@/lib/og/share-image';

interface TalkShareImageProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

export default async function Image({ params }: TalkShareImageProps) {
  const { speakerSlug, talkSlug } = await params;
  const talkResult = await loadTalkBySlug(speakerSlug, talkSlug);

  if (!talkResult) {
    notFound();
  }

  const { speaker, talk } = talkResult;

  return shareImage(
    buildSharePropsForTalk({
      speaker,
      title: talk.title,
    })
  );
}
