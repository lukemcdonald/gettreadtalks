export function uniqueSpeakersFromTalks<TSpeaker extends { _id: string }>(
  talks: { speaker: TSpeaker | null }[]
) {
  const speakers = talks
    .map((talk) => talk.speaker)
    .filter((speaker): speaker is TSpeaker => speaker !== null);

  return [
    ...new Map(
      speakers.map((speaker) => [speaker._id, speaker] as const)
    ).values(),
  ];
}
