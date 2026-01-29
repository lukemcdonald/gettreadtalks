type MediaType =
  | { type: 'youtube'; id: string }
  | { type: 'vimeo'; id: string }
  | { type: 'audio'; src: string }
  | { type: 'video'; src: string }
  | { type: 'unknown'; href: string };

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
];

const VIMEO_PATTERN = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov)(\?|$)/i;
const AUDIO_EXTENSION_PATTERN = /\.(mp3|wav|ogg|m4a|aac)(\?|$)/i;

function parseYouTubeUrl(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

function parseVimeoUrl(url: string): string | null {
  const match = url.match(VIMEO_PATTERN);
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

  if (VIDEO_EXTENSION_PATTERN.test(url)) {
    return { type: 'video', src: url };
  }
  if (AUDIO_EXTENSION_PATTERN.test(url)) {
    return { type: 'audio', src: url };
  }

  return { type: 'unknown', href: url };
}
