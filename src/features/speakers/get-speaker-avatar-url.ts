import { slugify } from '@/convex/lib/utils';

const SPEAKER_AVATAR_DIRECTORY = '/images/speakers';

/**
 * Avatars are files at `public/images/speakers/{slug}.jpg` (also jpeg, png, or
 * webp). Name the file after the speaker's Convex slug — the same value as the
 * `/speakers/{slug}` URL. Accents are folded to ASCII and punctuation is
 * stripped, matching slug creation. Convex `imageUrl` is only used when no
 * matching file exists.
 */
const SPEAKER_AVATAR_FILES = [
  'albert-martin.jpg',
  'albert-mohler.jpg',
  'alex-montoya.jpg',
  'alistair-begg.jpg',
  'austin-duncan.jpg',
  'aw-tozer.jpg',
  'billy-graham.jpg',
  'brooks-simpson.jpg',
  'bryan-loritts.jpg',
  'conrad-mbewe.jpg',
  'david-platt.jpg',
  'derek-thomas.jpg',
  'eric-mason.jpg',
  'francis-chan.jpg',
  'greg-bahnsen.jpg',
  'james-white.jpg',
  'jay-adams.jpg',
  'jeff-durbin.jpg',
  'john-macarthur.jpg',
  'john-piper.jpg',
  'joni-eareckson-tada.jpg',
  'jonny-ardavanis.jpg',
  'josh-buice.jpg',
  'kevin-carson.jpg',
  'leonard-ravenhill.jpg',
  'martin-loyd-jones.jpg',
  'matt-chandler.jpg',
  'mez-mcconnell.jpg',
  'michael-mahoney.jpg',
  'mike-fabarez.jpg',
  'mike-kelsey.jpg',
  'mike-riccardi.jpg',
  'nathan-busenitz.jpg',
  'paris-reidhead.jpg',
  'paul-twiss.jpg',
  'paul-washer.jpg',
  'phil-johnson.jpg',
  'philip-anthony-mitchell.jpg',
  'ravi-zacharias.jpg',
  'rc-sproul.jpg',
  'richard-owen-roberts.jpg',
  'rt-kendall.jpg',
  'rusty-thomas.jpg',
  'shai-linne.jpg',
  'steven-lawson.jpg',
  'tim-challies.jpg',
  'tim-keesee.jpg',
  'tony-miano.jpg',
  'tony-payne.jpg',
  'vance-havner.jpg',
  'voddie-baucham.jpg',
  'wa-criswell.jpg',
  'walter-martin.jpg',
] as const;

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

const SPEAKER_AVATAR_PATHS = buildSpeakerAvatarPaths(SPEAKER_AVATAR_FILES);

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
