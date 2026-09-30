import type { ClipFormData } from '../schemas/clip-form';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkListItem } from '@/features/talks/types';
import type { Control } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import {
  OptionalSelect,
  StatusField,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipFormFieldsProps {
  control: Control<ClipFormData>;
  speakers: SpeakerListItem[];
  talks: TalkListItem[];
}

export function ClipFormFields({
  control,
  speakers,
  talks,
}: ClipFormFieldsProps) {
  const sortedSpeakers = speakers.toSorted((a, b) => {
    const nameA = getSpeakerName(a).toLowerCase();
    const nameB = getSpeakerName(b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const sortedTalks = talks.toSorted((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="space-y-4">
      <TextField
        control={control}
        label="Title"
        name="title"
        placeholder="Grace in Action"
        required
      />

      <UrlField
        control={control}
        label="Media URL"
        name="mediaUrl"
        placeholder="https://example.com/clip.mp4"
        required
      />

      <TextareaField
        control={control}
        description="Brief description of this clip"
        label="Description"
        name="description"
        placeholder="A powerful moment from..."
        rows={3}
      />

      <Controller
        control={control}
        name="speakerId"
        render={({ field }) => (
          <OptionalSelect
            items={sortedSpeakers.map((speaker) => ({
              label: getSpeakerName(speaker),
              value: speaker._id,
            }))}
            label="Speaker (Optional)"
            name="speakerId"
            onValueChange={(value) => {
              field.onChange(value);
            }}
            value={field.value}
          />
        )}
      />

      <Controller
        control={control}
        name="talkId"
        render={({ field }) => (
          <OptionalSelect
            items={sortedTalks.map((talk) => ({
              label: talk.title,
              value: talk._id,
            }))}
            label="From Talk (Optional)"
            name="talkId"
            onValueChange={(value) => {
              field.onChange(value);
            }}
            value={field.value}
          />
        )}
      />

      <StatusField control={control} name="status" />
    </div>
  );
}
