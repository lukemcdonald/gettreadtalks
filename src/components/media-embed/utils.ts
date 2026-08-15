export type MediaType =
  | { type: 'audio'; src: string }
  | { type: 'unknown'; href: string }
  | { type: 'video'; src: string }
  | { type: 'vimeo'; id: string }
  | { type: 'youtube'; id: string };

const AUDIO_REGEX = /\.(?<format>mp3|wav|ogg|m4a|aac)(?<query>\?|$)/iu;
const VIDEO_REGEX = /\.(?<format>mp4|webm|ogg|mov)(?<query>\?|$)/iu;
const VIMEO_REGEX = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(?<id>\d+)/u;
const YOUTUBE_REGEX = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)(?<id>[^&\n?#]+)/u,
  /youtube\.com\/watch\?.*v=(?<id>[^&\n?#]+)/u,
];

function parseYouTubeUrl(url: string) {
  for (const pattern of YOUTUBE_REGEX) {
    const match = url.match(pattern);
    if (match?.groups?.id) {
      return match.groups.id;
    }
  }
  return null;
}

function parseVimeoUrl(url: string) {
  const match = url.match(VIMEO_REGEX);
  return match?.groups?.id ?? null;
}

export function getVideoThumbnail(url?: string) {
  if (!url) {
    return null;
  }

  const youtubeId = parseYouTubeUrl(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  const vimeoId = parseVimeoUrl(url);
  if (vimeoId) {
    return `https://vumbnail.com/${vimeoId}.jpg`;
  }

  return null;
}

export function detectMediaType(url: string): MediaType {
  const youtubeId = parseYouTubeUrl(url);
  if (youtubeId) {
    return { id: youtubeId, type: 'youtube' };
  }

  const vimeoId = parseVimeoUrl(url);
  if (vimeoId) {
    return { id: vimeoId, type: 'vimeo' };
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
