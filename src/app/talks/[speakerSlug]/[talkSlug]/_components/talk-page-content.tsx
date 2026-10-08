import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { TalkContentSections } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-content-sections';
import { TalkHero } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero';
import {
  TalkPageSkeleton,
  TalkRelatedTalksSkeleton,
} from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-page-skeleton';
import { TalkRelatedTalks } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-related-talks';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { isVideoMediaType } from '@/components/media-embed';
import { site } from '@/configs/site';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkBySlug } from '@/features/talks/queries/get-talk-by-slug';
import { getTalkBySlugAdmin } from '@/features/talks/queries/get-talk-by-slug-admin';
import { getTalkUrl } from '@/features/talks/utils';

type TalkBySlug = NonNullable<Awaited<ReturnType<typeof getTalkBySlug>>>;

interface TalkPageContentProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

interface TalkDocumentProps {
  speakerSlug: string;
  talkResult: TalkBySlug;
  talkSlug: string;
}

function talkJsonLd({
  speaker,
  speakerSlug,
  talk,
  talkSlug,
}: {
  speaker: TalkBySlug['speaker'];
  speakerSlug: string;
  talk: TalkBySlug['talk'];
  talkSlug: string;
}) {
  const speakerName = getSpeakerName(speaker);

  return {
    '@context': 'https://schema.org',
    '@type': isVideoMediaType(talk.mediaUrl) ? 'VideoObject' : 'AudioObject',
    description: talk.description,
    embedUrl: talk.mediaUrl,
    name: talk.title,
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(talk.publishedAt && {
      uploadDate: new Date(talk.publishedAt).toISOString(),
    }),
    url: `${site.url}${getTalkUrl(speakerSlug, talkSlug)}`,
  };
}

function TalkDocument({
  speakerSlug,
  talkResult,
  talkSlug,
}: TalkDocumentProps) {
  const { clips, collection, speaker, talk, topics } = talkResult;

  return (
    <>
      <JsonLd data={talkJsonLd({ speaker, speakerSlug, talk, talkSlug })} />
      <EditorialProfileLayout
        content={
          <TalkContentSections
            clips={clips}
            collection={collection}
            relatedTalks={
              speaker ? (
                <Suspense fallback={<TalkRelatedTalksSkeleton />}>
                  <TalkRelatedTalks
                    excludeTalkId={talk._id}
                    speaker={speaker}
                  />
                </Suspense>
              ) : null
            }
            speaker={speaker}
            talk={talk}
            topics={topics}
          />
        }
        hero={<TalkHero speaker={speaker} talk={talk} />}
      />
    </>
  );
}

async function TalkAdminDraft({
  speakerSlug,
  talkSlug,
}: {
  speakerSlug: string;
  talkSlug: string;
}) {
  const talkResult = await getTalkBySlugAdmin(speakerSlug, talkSlug);

  if (!talkResult) {
    notFound();
  }

  return (
    <TalkDocument
      speakerSlug={speakerSlug}
      talkResult={talkResult}
      talkSlug={talkSlug}
    />
  );
}

export async function TalkPageContent({ params }: TalkPageContentProps) {
  const { speakerSlug, talkSlug } = await params;
  const talkResult = await getTalkBySlug(speakerSlug, talkSlug);

  if (!talkResult) {
    return (
      <Suspense fallback={<TalkPageSkeleton />}>
        <TalkAdminDraft speakerSlug={speakerSlug} talkSlug={talkSlug} />
      </Suspense>
    );
  }

  return (
    <TalkDocument
      speakerSlug={speakerSlug}
      talkResult={talkResult}
      talkSlug={talkSlug}
    />
  );
}
