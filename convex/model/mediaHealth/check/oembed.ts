import type { MediaCheckStatus } from '../validators';

import { getVideoId } from '../../../lib/videoUrl';

const STATUS_BY_HTTP: Record<number, MediaCheckStatus> = {
  200: 'ok',
  401: 'private',
  403: 'private',
  404: 'missing',
};

const OEMBED_TIMEOUT_MS = 8000;

export function classifyOEmbedStatus(status?: number): MediaCheckStatus {
  if (status === undefined) {
    return 'unknown';
  }

  return STATUS_BY_HTTP[status] ?? 'unknown';
}

export function getOEmbedRequest(mediaUrl: string): URL | null {
  const video = getVideoId(mediaUrl);

  if (video?.service === 'youtube') {
    const href = new URL('https://www.youtube.com/oembed');
    href.searchParams.set('format', 'json');
    href.searchParams.set('url', mediaUrl);

    return href;
  }

  if (video?.service === 'vimeo') {
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
