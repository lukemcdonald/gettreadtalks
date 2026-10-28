import { buildMediaJsonLd } from '@/components/media-embed/utils';
import { getSiteLanguage, site } from '@/configs/site';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { buildTalkPath } from '@/features/talks/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';
import { getOrganizationJsonLd } from '@/lib/json-ld';

interface TalkJsonLdSpeaker {
  firstName: string;
  imageUrl?: string;
  lastName: string;
}

interface TalkJsonLdInput {
  speaker: TalkJsonLdSpeaker | null;
  speakerSlug: string;
  summary?: string | null;
  talk: {
    _creationTime?: number;
    mediaUrl?: string;
    publishedAt?: number;
    title: string;
  };
  talkSlug: string;
}

function getTalkCreatorJsonLd(
  speaker: TalkJsonLdSpeaker | null,
  speakerSlug: string
) {
  const name = getSpeakerName(speaker);

  if (!name) {
    return;
  }

  return {
    '@type': 'Person' as const,
    ...(speaker?.imageUrl && { image: speaker.imageUrl }),
    name,
    url: buildAbsoluteUrl(buildSpeakerPath({ slug: speakerSlug })),
  };
}

function getTalkDescription(
  summary: string | null | undefined,
  title: string,
  speakerName: string
) {
  const published = summary?.trim();

  if (published) {
    return published;
  }

  const byline = speakerName ? ` by ${speakerName}` : '';

  return `${title}${byline}. ${site.description}`;
}

function getTalkUploadDate(talk: TalkJsonLdInput['talk']) {
  const uploadedAt = talk.publishedAt ?? talk._creationTime;

  if (!uploadedAt) {
    return;
  }

  return new Date(uploadedAt).toISOString();
}

export function buildTalkJsonLd({
  speaker,
  speakerSlug,
  summary,
  talk,
  talkSlug,
}: TalkJsonLdInput) {
  const speakerName = getSpeakerName(speaker);
  const talkUrl = buildAbsoluteUrl(
    buildTalkPath({ speaker: { slug: speakerSlug }, slug: talkSlug })
  );
  const creator = getTalkCreatorJsonLd(speaker, speakerSlug);
  const uploadDate = getTalkUploadDate(talk);

  return {
    '@context': 'https://schema.org',
    ...(buildMediaJsonLd(talk.mediaUrl, {
      thumbnailUrl: `${talkUrl}/opengraph-image`,
    }) ?? { '@type': 'CreativeWork' as const }),
    ...(creator && { creator }),
    description: getTalkDescription(summary, talk.title, speakerName),
    inLanguage: getSiteLanguage(),
    name: talk.title,
    publisher: getOrganizationJsonLd(),
    ...(uploadDate && { uploadDate }),
    url: talkUrl,
  };
}
