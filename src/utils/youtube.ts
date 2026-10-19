const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)(?<id>[A-Za-z0-9_-]{11})/u;

export function parseYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_ID_PATTERN);

  return match?.groups?.id ?? null;
}

export function toYouTubeWatchUrl(url: string): string {
  const youtubeId = parseYouTubeId(url);

  if (!youtubeId) {
    return url;
  }

  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
