import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { TalkContentSections } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-content-sections';
import { TalkHero } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-hero';
import { buildTalkJsonLd } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-json-ld';
import {
  TalkPageSkeleton,
  TalkRelatedTalksSkeleton,
} from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-page-skeleton';
import { TalkRelatedTalks } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-related-talks';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { loadTalkBySlug } from '@/features/talks/queries/load-talk-by-slug';
import { loadTalkBySlugAdmin } from '@/features/talks/queries/load-talk-by-slug-admin';
import { buildTalkPath, buildTalksPath } from '@/features/talks/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';

type TalkBySlug = NonNullable<Awaited<ReturnType<typeof loadTalkBySlug>>>;

interface TalkPageContentProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

interface TalkDetailProps {
  speakerSlug: string;
  talkResult: TalkBySlug;
  talkSlug: string;
}

function TalkDetail({ speakerSlug, talkResult, talkSlug }: TalkDetailProps) {
  const { clips, collection, speaker, summary, talk, topics } = talkResult;
  const segments = [
    { href: buildTalksPath(), label: 'Talks' },
    { href: buildTalkPath({ speaker, slug: talk.slug }), label: talk.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <JsonLd
        data={buildTalkJsonLd({
          speaker,
          speakerSlug,
          summary,
          talk,
          talkSlug,
        })}
      />
      <EditorialProfileLayout
        content={
          <TalkContentSections
            clips={clips}
            collection={collection}
            relatedTalks={
              <Suspense fallback={<TalkRelatedTalksSkeleton />}>
                <TalkRelatedTalks
                  excludeTalkId={talk._id}
                  speaker={speaker}
                  topics={topics}
                />
              </Suspense>
            }
            speaker={speaker}
            summary={summary}
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
  const talkResult = await loadTalkBySlugAdmin(speakerSlug, talkSlug);

  if (!talkResult) {
    notFound();
  }

  return (
    <TalkDetail
      speakerSlug={speakerSlug}
      talkResult={talkResult}
      talkSlug={talkSlug}
    />
  );
}

export async function TalkPageContent({ params }: TalkPageContentProps) {
  const { speakerSlug, talkSlug } = await params;
  const talkResult = await loadTalkBySlug(speakerSlug, talkSlug);

  if (!talkResult) {
    return (
      <Suspense fallback={<TalkPageSkeleton />}>
        <TalkAdminDraft speakerSlug={speakerSlug} talkSlug={talkSlug} />
      </Suspense>
    );
  }

  return (
    <TalkDetail
      speakerSlug={speakerSlug}
      talkResult={talkResult}
      talkSlug={talkSlug}
    />
  );
}
