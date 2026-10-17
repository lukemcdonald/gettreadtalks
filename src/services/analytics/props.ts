interface TrackEntity {
  _id: string;
  slug: string;
}

export function buildSpeakerTrackProps(speaker: TrackEntity) {
  return {
    speaker_id: speaker._id,
    speaker_slug: speaker.slug,
  };
}

export function buildTalkTrackProps(
  talk: TrackEntity,
  speaker?: TrackEntity | null
) {
  return {
    ...(speaker ? { speaker_id: speaker._id, speaker_slug: speaker.slug } : {}),
    talk_id: talk._id,
    talk_slug: talk.slug,
  };
}
