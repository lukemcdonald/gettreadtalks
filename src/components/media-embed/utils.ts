import { getVideoId } from '@/convex/lib/videoUrl';

export type MediaType =
  | { type: 'audio'; src: string }
  | { type: 'unknown'; href: string }
  | { type: 'video'; src: string }
  | { type: 'vimeo'; id: string }
  | { type: 'youtube'; id: string };

const AUDIO_REGEX = /\.(?<format>mp3|wav|ogg|m4a|aac)(?<query>\?|$)/iu;
const VIDEO_REGEX = /\.(?<format>mp4|webm|ogg|mov)(?<query>\?|$)/iu;

export function getVideoThumbnail(url?: string) {
  if (!url) {
    return null;
  }

  const video = getVideoId(url);

  if (video?.service === 'youtube') {
    return `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  }

  if (video?.service === 'vimeo') {
    return `https://vumbnail.com/${video.id}.jpg`;
  }

  return null;
}

export function detectMediaType(url: string): MediaType {
  const video = getVideoId(url);

  if (video?.service === 'youtube') {
    return { id: video.id, type: 'youtube' };
  }

  if (video?.service === 'vimeo') {
    return { id: video.id, type: 'vimeo' };
  }

  if (VIDEO_REGEX.test(url)) {
    return { src: url, type: 'video' };
  }

  if (AUDIO_REGEX.test(url)) {
    return { src: url, type: 'audio' };
  }

  return { href: url, type: 'unknown' };
}

export function isVideoMediaType(url?: string): boolean {
  if (!url) {
    return false;
  }
  const mediaType = detectMediaType(url);
  return (
    mediaType.type === 'youtube' ||
    mediaType.type === 'vimeo' ||
    mediaType.type === 'video'
  );
}

export function getVideoOpenGraphType(url?: string) {
  if (isVideoMediaType(url)) {
    return 'video.other' as const;
  }
}

function getJsonLdThumbnailUrls(url: string, fallbackThumbnailUrl?: string) {
  const thumbnailUrls = [getVideoThumbnail(url), fallbackThumbnailUrl].filter(
    (thumbnailUrl): thumbnailUrl is string => Boolean(thumbnailUrl)
  );

  if (thumbnailUrls.length === 0) {
    return;
  }

  return { thumbnailUrl: thumbnailUrls };
}

export function buildMediaJsonLd(
  url?: string,
  options?: { thumbnailUrl?: string }
) {
  if (!url) {
    return;
  }

  const media = detectMediaType(url);
  const thumbnails = getJsonLdThumbnailUrls(url, options?.thumbnailUrl);

  if (media.type === 'youtube') {
    return {
      '@type': 'VideoObject' as const,
      embedUrl: `https://www.youtube.com/embed/${media.id}`,
      ...thumbnails,
    };
  }

  if (media.type === 'vimeo') {
    return {
      '@type': 'VideoObject' as const,
      embedUrl: `https://player.vimeo.com/video/${media.id}`,
      ...thumbnails,
    };
  }

  if (media.type === 'video') {
    return {
      '@type': 'VideoObject' as const,
      contentUrl: media.src,
      ...thumbnails,
    };
  }

  if (media.type === 'audio') {
    return {
      '@type': 'AudioObject' as const,
      contentUrl: media.src,
    };
  }
}

export function preferItemsWithVideoThumbnails<T extends { mediaUrl?: string }>(
  items: T[]
): T[] {
  const withThumbnails = items.filter(
    (item) => getVideoThumbnail(item.mediaUrl) !== null
  );

  if (withThumbnails.length > 0) {
    return withThumbnails;
  }

  return items;
}
