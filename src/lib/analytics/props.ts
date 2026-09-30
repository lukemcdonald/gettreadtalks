export function speakerTrackProps(speaker: { _id: string; slug: string }) {
  return {
    speaker_id: speaker._id,
    speaker_slug: speaker.slug,
  };
}

export function talkTrackProps(
  talk: { _id: string; slug: string },
  speakerSlug: string
) {
  return {
    speaker_slug: speakerSlug,
    talk_id: talk._id,
    talk_slug: talk.slug,
  };
}
