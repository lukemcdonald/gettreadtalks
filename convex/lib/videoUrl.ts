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

export function hasTalkTranscriptSource(mediaUrl: string) {
  return getVideoId(mediaUrl)?.service === 'youtube';
}
