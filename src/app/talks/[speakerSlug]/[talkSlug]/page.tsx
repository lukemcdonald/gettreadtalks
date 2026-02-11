import { notFound } from 'next/navigation';

import { TalkContentSections } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-content-sections';
import { TalkHero } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero';
import { EditorialProfileLayout } from '@/components/layouts';
import { getRandomTalksBySpeaker } from '@/features/talks/queries/get-random-talks-by-speaker';
import { getTalkBySlug } from '@/features/talks/queries/get-talk-by-slug';

interface TalkPageProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

export default async function TalkPage({ params }: TalkPageProps) {
  const { speakerSlug, talkSlug } = await params;
  const talkResult = await getTalkBySlug(speakerSlug, talkSlug);

  if (!talkResult) {
    notFound();
  }

  const { clips, collection, speaker, talk, topics } = talkResult;

  // Fetch related talks from same speaker
  const relatedTalks = speaker ? await getRandomTalksBySpeaker(speaker._id, talk._id, 5) : [];

  return (
    <EditorialProfileLayout
      content={
        <TalkContentSections
          clips={clips}
          collection={collection}
          relatedTalks={relatedTalks}
          speaker={speaker}
          talk={talk}
        />
      }
      hero={
        <TalkHero
          speaker={speaker}
          speakerSlug={speakerSlug}
          talk={talk}
          talkSlug={talkSlug}
          topics={topics}
        />
      }
    />
  );
}
