export type MediaType =
  | { type: 'audio'; src: string }
  | { type: 'unknown'; href: string }
  | { type: 'video'; src: string }
  | { type: 'vimeo'; id: string }
  | { type: 'youtube'; id: string };

const AUDIO_REGEX = /\.(mp3|wav|ogg|m4a|aac)(\?|$)/i;
const VIDEO_REGEX = /\.(mp4|webm|ogg|mov)(\?|$)/i;
const VIMEO_REGEX = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
const YOUTUBE_REGEX = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
];

function parseYouTubeUrl(url: string) {
  for (const pattern of YOUTUBE_REGEX) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

function parseVimeoUrl(url: string) {
  const match = url.match(VIMEO_REGEX);
  return match?.[1] ?? null;
}

export function detectMediaType(url: string): MediaType {
  const youtubeId = parseYouTubeUrl(url);
  if (youtubeId) {
    return { type: 'youtube', id: youtubeId };
  }

  const vimeoId = parseVimeoUrl(url);
  if (vimeoId) {
    return { type: 'vimeo', id: vimeoId };
  }

  if (VIDEO_REGEX.test(url)) {
    return { type: 'video', src: url };
  }

  if (AUDIO_REGEX.test(url)) {
    return { type: 'audio', src: url };
  }

  return { type: 'unknown', href: url };
}
