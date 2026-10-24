'use client';

import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';

import { ComboboxItem } from '@/components/ui';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers/utils';

import { getSpeakerById } from './speaker-field-utils';

interface SpeakerComboboxItemProps {
  speakers: SpeakerListItem[];
  value: SpeakerId;
}

export function SpeakerComboboxItem({
  speakers,
  value,
}: SpeakerComboboxItemProps) {
  const speaker = getSpeakerById(speakers, value);

  if (!speaker) {
    return null;
  }

  return (
    <ComboboxItem key={speaker._id} value={speaker._id}>
      <div className="flex items-center gap-3">
        <SpeakerAvatar rounded="full" size="sm" speaker={speaker} />
        <div className="flex flex-col">
          <span className="font-medium">{getSpeakerName(speaker)}</span>
          {!!speaker.role && (
            <span className="text-muted-foreground text-xs">
              {speaker.role}
            </span>
          )}
        </div>
      </div>
    </ComboboxItem>
  );
}
