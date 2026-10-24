import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';

import { getSpeakerName } from '@/features/speakers/utils';

export interface SpeakerFieldValue {
  name: string;
  onChange: (value: SpeakerId | undefined) => void;
  value: SpeakerId | undefined;
}

export function getSortedSpeakers(speakers: SpeakerListItem[]) {
  return speakers.toSorted((a, b) => {
    const nameA = getSpeakerName(a).toLowerCase();
    const nameB = getSpeakerName(b).toLowerCase();

    return nameA.localeCompare(nameB);
  });
}

export function getSpeakerById(
  speakers: SpeakerListItem[],
  speakerId: SpeakerId
) {
  return speakers.find((speaker) => speaker._id === speakerId);
}

export function filterSpeakerByQuery(
  speakers: SpeakerListItem[],
  itemValue: SpeakerId,
  query: string
) {
  const speaker = getSpeakerById(speakers, itemValue);

  if (!speaker) {
    return false;
  }

  return getSpeakerName(speaker).toLowerCase().includes(query.toLowerCase());
}

export function getSpeakerItemLabel(
  speakers: SpeakerListItem[],
  itemValue: SpeakerId
) {
  const speaker = getSpeakerById(speakers, itemValue);

  return speaker ? getSpeakerName(speaker) : '';
}
