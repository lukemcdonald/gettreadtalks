import type { MediaCheckStatus } from './validators';

const STATUS_BY_HTTP: Record<number, MediaCheckStatus> = {
  200: 'ok',
  401: 'private',
  403: 'private',
  404: 'missing',
};

const VIMEO_REGEX = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(?<id>\d+)/u;
const YOUTUBE_REGEX = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)(?<id>[^&\n?#]+)/u,
  /youtube\.com\/watch\?.*v=(?<id>[^&\n?#]+)/u,
];

const OEMBED_TIMEOUT_MS = 8000;

export function classifyOEmbedStatus(status?: number): MediaCheckStatus {
  if (status === undefined) {
    return 'unknown';
  }

  return STATUS_BY_HTTP[status] ?? 'unknown';
}

export function getOEmbedRequest(mediaUrl: string): URL | null {
  if (isYouTubeUrl(mediaUrl)) {
    const href = new URL('https://www.youtube.com/oembed');
    href.searchParams.set('format', 'json');
    href.searchParams.set('url', mediaUrl);

    return href;
  }

  if (isVimeoUrl(mediaUrl)) {
    const href = new URL('https://vimeo.com/api/oembed.json');
    href.searchParams.set('url', mediaUrl);

    return href;
  }

  return null;
}

export async function checkMediaUrl(
  mediaUrl: string,
  fetchImpl: typeof fetch = fetch
): Promise<{ skipped: true } | { skipped: false; status: MediaCheckStatus }> {
  const request = getOEmbedRequest(mediaUrl);

  if (!request) {
    return { skipped: true };
  }

  try {
    const response = await fetchImpl(request, {
      method: 'GET',
      signal: AbortSignal.timeout(OEMBED_TIMEOUT_MS),
    });

    return {
      skipped: false,
      status: classifyOEmbedStatus(response.status),
    };
  } catch {
    return {
      skipped: false,
      status: 'unknown',
    };
  }
}

function isVimeoUrl(url: string) {
  return VIMEO_REGEX.test(url);
}

function isYouTubeUrl(url: string) {
  return YOUTUBE_REGEX.some((pattern) => pattern.test(url));
}
