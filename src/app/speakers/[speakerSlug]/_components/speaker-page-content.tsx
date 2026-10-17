import type { Talk } from '@/features/talks/types';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { SpeakerContentSections } from '@/app/speakers/[speakerSlug]/_components/speaker-content-sections';
import { SpeakerHero } from '@/app/speakers/[speakerSlug]/_components/speaker-hero';
import { SpeakerHeroSkeleton } from '@/app/speakers/[speakerSlug]/_components/speaker-hero-skeleton';
import {
  getFeaturedHeroCandidates,
  getSpeakerTalkLayout,
} from '@/app/speakers/[speakerSlug]/_components/speaker-hero-talks';
import { buildSpeakerJsonLd } from '@/app/speakers/[speakerSlug]/_components/speaker-json-ld';
import { SpeakerContentSkeleton } from '@/app/speakers/[speakerSlug]/_components/speaker-page-skeleton';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { loadSpeakerBySlug } from '@/features/speakers/queries/load-speaker-by-slug';
import {
  buildSpeakerUrl,
  buildSpeakersPath,
  getSpeakerName,
} from '@/features/speakers/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';
import { rotateCachedContent } from '@/utils';

interface SpeakerPageContentProps {
  params: Promise<{ speakerSlug: string }>;
}

async function loadFeaturedTalkForHero(talks: Talk[]) {
  const [featuredTalk] = await rotateCachedContent(
    getFeaturedHeroCandidates(talks),
    {
      count: 1,
      period: 'daily',
    }
  );

  return featuredTalk;
}

async function SpeakerHeroSection({ speakerSlug }: { speakerSlug: string }) {
  const data = await loadSpeakerBySlug(speakerSlug);

  if (!data) {
    notFound();
  }

  const { speaker, talks } = data;
  const { featuredTalk } = getSpeakerTalkLayout(
    talks,
    await loadFeaturedTalkForHero(talks)
  );
  const name = getSpeakerName(speaker);
  const segments = [
    { href: buildSpeakersPath(), label: 'Speakers' },
    { href: buildSpeakerUrl(speakerSlug), label: name },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <JsonLd
        data={buildSpeakerJsonLd({
          description: speaker.description,
          imageUrl: speaker.imageUrl,
          name,
          speakerSlug,
          websiteUrl: speaker.websiteUrl,
        })}
      />
      <SpeakerHero featuredTalk={featuredTalk} speaker={speaker} />
    </>
  );
}

async function SpeakerRelatedContent({ speakerSlug }: { speakerSlug: string }) {
  const data = await loadSpeakerBySlug(speakerSlug);

  if (!data) {
    notFound();
  }

  const { clips, collections, speaker, talks } = data;
  const { featuredTalk, remainingTalks } = getSpeakerTalkLayout(
    talks,
    await loadFeaturedTalkForHero(talks)
  );

  return (
    <SpeakerContentSections
      clips={clips}
      collections={collections}
      hasFeaturedVideo={Boolean(featuredTalk)}
      speaker={speaker}
      talks={remainingTalks}
    />
  );
}

export async function SpeakerPageContent({ params }: SpeakerPageContentProps) {
  const { speakerSlug } = await params;

  return (
    <EditorialProfileLayout
      content={
        <Suspense fallback={<SpeakerContentSkeleton />}>
          <SpeakerRelatedContent speakerSlug={speakerSlug} />
        </Suspense>
      }
      hero={
        <Suspense fallback={<SpeakerHeroSkeleton />}>
          <SpeakerHeroSection speakerSlug={speakerSlug} />
        </Suspense>
      }
    />
  );
}
