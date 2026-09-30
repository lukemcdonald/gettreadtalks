import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

export function speakerTrackProps(speaker: Pick<Speaker, '_id' | 'slug'>) {
  return {
    speaker_id: speaker._id,
    speaker_slug: speaker.slug,
  };
}

export function talkTrackProps(
  talk: Pick<Talk, '_id' | 'slug'>,
  speaker?: Pick<Speaker, '_id' | 'slug'> | null
) {
  return {
    ...(speaker ? { speaker_id: speaker._id, speaker_slug: speaker.slug } : {}),
    talk_id: talk._id,
    talk_slug: talk.slug,
  };
}
