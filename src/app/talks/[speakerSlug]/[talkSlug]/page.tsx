import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { TalkContentSections } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-content-sections';
import { TalkHero } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { isVideoMediaType } from '@/components/media-embed';
import { site } from '@/configs/site';
import { getRandomTalksBySpeaker } from '@/features/talks/queries/get-random-talks-by-speaker';
import { getTalkBySlug } from '@/features/talks/queries/get-talk-by-slug';

interface TalkPageProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

export async function generateMetadata({ params }: TalkPageProps): Promise<Metadata> {
  const { speakerSlug, talkSlug } = await params;
  const talkResult = await getTalkBySlug(speakerSlug, talkSlug);

  if (!talkResult) {
    return {};
  }

  const { speaker, talk } = talkResult;
  const speakerName = speaker ? `${speaker.firstName} ${speaker.lastName}` : '';

  return {
    description: talk.description ?? (speakerName ? `A talk by ${speakerName}.` : undefined),
    openGraph: speaker?.imageUrl
      ? { images: [{ alt: speakerName, height: 630, url: speaker.imageUrl, width: 1200 }] }
      : undefined,
    title: talk.title,
  };
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

  const speakerName = speaker ? `${speaker.firstName} ${speaker.lastName}` : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': isVideoMediaType(talk.mediaUrl) ? 'VideoObject' : 'AudioObject',
    description: talk.description,
    embedUrl: talk.mediaUrl,
    name: talk.title,
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(talk.publishedAt && { uploadDate: new Date(talk.publishedAt).toISOString() }),
    url: `${site.url}/talks/${speakerSlug}/${talkSlug}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <EditorialProfileLayout
        content={
          <TalkContentSections
            clips={clips}
            collection={collection}
            relatedTalks={relatedTalks}
            speaker={speaker}
            talk={talk}
            topics={topics}
          />
        }
        hero={<TalkHero speaker={speaker} speakerSlug={speakerSlug} talk={talk} />}
      />
    </>
  );
}
