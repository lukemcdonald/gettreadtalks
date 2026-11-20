import getVideoIdFromUrl from 'get-video-id';

interface VideoId {
  id: string;
  service: 'vimeo' | 'youtube';
}

export function getVideoId(url: string): VideoId | null {
  if (!url) {
    return null;
  }

  const { id, service } = getVideoIdFromUrl(url);

  if (!id || (service !== 'vimeo' && service !== 'youtube')) {
    return null;
  }

  return { id, service };
}

/** Any http(s) URL is a candidate; the transcripts service decides support. */
export function hasTalkTranscriptSource(mediaUrl: string) {
  try {
    const { protocol } = new URL(mediaUrl.trim());

    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}
