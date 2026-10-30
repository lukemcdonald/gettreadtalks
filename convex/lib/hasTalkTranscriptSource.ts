import { getVideoId } from './videoUrl';

export const NO_TRANSCRIPT_SOURCE_MESSAGE = 'Generating needs a YouTube video.';

export function hasTalkTranscriptSource(mediaUrl: string) {
  return getVideoId(mediaUrl)?.service === 'youtube';
}
