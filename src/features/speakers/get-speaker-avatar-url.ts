import { slugify } from '@/convex/lib/utils';

const SPEAKER_AVATAR_DIRECTORY = '/images/speakers';

/**
 * Avatars are files at `public/images/speakers/{slug}.jpg` (also jpeg, png, or
 * webp). Drop a file named after the speaker's Convex slug — the same value as
 * the `/speakers/{slug}` URL.
 */
const SPEAKER_AVATAR_MODULES = import.meta.glob([
  '/public/images/speakers/*.jpeg',
  '/public/images/speakers/*.jpg',
  '/public/images/speakers/*.png',
  '/public/images/speakers/*.webp',
]);

interface SpeakerAvatarFields {
  firstName?: string;
  lastName?: string;
  slug?: string;
}

function toSpeakerAvatarSlug(value: string) {
  return slugify(value.normalize('NFD').replaceAll(/\p{M}/gu, ''));
}

function getSpeakerAvatarSlug({
  firstName,
  lastName,
  slug,
}: SpeakerAvatarFields) {
  if (slug) {
    return toSpeakerAvatarSlug(slug);
  }

  return toSpeakerAvatarSlug(`${firstName ?? ''} ${lastName ?? ''}`.trim());
}

function buildSpeakerAvatarPaths() {
  const paths: Record<string, string> = {};

  for (const filePath of Object.keys(SPEAKER_AVATAR_MODULES)) {
    const filename = filePath.split('/').at(-1);

    if (!filename || filename.includes('-banner')) {
      continue;
    }

    const slug = toSpeakerAvatarSlug(filename.replace(/\.[^.]+$/u, ''));
    paths[slug] = `${SPEAKER_AVATAR_DIRECTORY}/${filename}`;
  }

  return paths;
}

const SPEAKER_AVATAR_PATHS = buildSpeakerAvatarPaths();

export function getSpeakerAvatarUrl(speaker: SpeakerAvatarFields) {
  const slug = getSpeakerAvatarSlug(speaker);

  if (!slug) {
    return;
  }

  return SPEAKER_AVATAR_PATHS[slug];
}
