import { slugify } from '@/convex/lib/utils';

const SPEAKER_AVATAR_DIRECTORY = '/images/speakers';

/**
 * Avatars are files at `public/images/speakers/{slug}.jpg` (also jpeg, png, or
 * webp). Drop a file named after the speaker's Convex slug — the same value as
 * the `/speakers/{slug}` URL. Accents are folded to ASCII and punctuation is
 * stripped, matching slug creation. Convex `imageUrl` is only used when no
 * matching file exists.
 */
const SPEAKER_AVATAR_MODULES = import.meta.glob([
  '/public/images/speakers/*.jpeg',
  '/public/images/speakers/*.jpg',
  '/public/images/speakers/*.png',
  '/public/images/speakers/*.webp',
]);

interface SpeakerAvatarFields {
  firstName?: string;
  imageUrl?: string;
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

function getSpeakerAvatarFilenames() {
  const filenames: string[] = [];

  for (const filePath of Object.keys(SPEAKER_AVATAR_MODULES)) {
    const filename = filePath.split('/').at(-1);

    if (!filename || filename.includes('-banner')) {
      continue;
    }

    filenames.push(filename);
  }

  return filenames;
}

function buildSpeakerAvatarPaths(filenames: readonly string[]) {
  const paths: Record<string, string> = {};

  for (const filename of filenames) {
    const slug = toSpeakerAvatarSlug(filename.replace(/\.[^.]+$/u, ''));
    paths[slug] = `${SPEAKER_AVATAR_DIRECTORY}/${filename}`;
  }

  return paths;
}

function getFallbackImageUrl(imageUrl?: string) {
  if (!imageUrl) {
    return;
  }

  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    if (url.pathname.startsWith(`${SPEAKER_AVATAR_DIRECTORY}/`)) {
      return url.pathname;
    }
  } catch {
    return imageUrl;
  }

  return imageUrl;
}

const SPEAKER_AVATAR_PATHS = buildSpeakerAvatarPaths(
  getSpeakerAvatarFilenames()
);

export function getSpeakerAvatarUrl(
  speaker: SpeakerAvatarFields,
  avatarFiles: Readonly<Record<string, string>> = SPEAKER_AVATAR_PATHS
) {
  const slug = getSpeakerAvatarSlug(speaker);
  const localPath = slug ? avatarFiles[slug] : undefined;

  if (localPath) {
    return localPath;
  }

  return getFallbackImageUrl(speaker.imageUrl);
}
