import { notFound } from 'next/navigation';

import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkBySlug } from '@/features/talks/queries/get-talk-by-slug';
import { shareImage, toShareSpeaker } from '@/lib/og/share-image';

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

  if (!speaker) {
    return shareImage({ title: talk.title });
  }

  return shareImage({
    speaker: toShareSpeaker({
      imageUrl: speaker.imageUrl,
      ministry: speaker.ministry,
      name: getSpeakerName(speaker),
      role: speaker.role,
    }),
    title: talk.title,
  });
}
