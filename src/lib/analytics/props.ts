import type { Doc } from '@/convex/_generated/dataModel';

export type SpeakerTrackEntity = Pick<Doc<'speakers'>, '_id' | 'slug'>;
export type TalkTrackEntity = Pick<Doc<'talks'>, '_id' | 'slug'>;

export function speakerTrackProps(speaker: SpeakerTrackEntity) {
  return {
    speaker_id: speaker._id,
    speaker_slug: speaker.slug,
  };
}

export function talkTrackProps(
  talk: TalkTrackEntity,
  speaker?: Pick<Doc<'speakers'>, 'slug'> | null
) {
  return {
    speaker_slug: speaker?.slug ?? '',
    talk_id: talk._id,
    talk_slug: talk.slug,
  };
}
