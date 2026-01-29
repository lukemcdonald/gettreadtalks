import type { Control, FieldValues, Path } from 'react-hook-form';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { TalkId, TalkListItem } from '@/features/talks/types';

import { Controller } from 'react-hook-form';

import {
  Field,
  FieldLabel,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
  StatusField,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipFormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  speakers: SpeakerListItem[];
  talks: TalkListItem[];
}

export function ClipFormFields<T extends FieldValues>({
  control,
  speakers,
  talks,
}: ClipFormFieldsProps<T>) {
  const sortedSpeakers = [...speakers].sort((a, b) => {
    const nameA = getSpeakerName(a).toLowerCase();
    const nameB = getSpeakerName(b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const sortedTalks = [...talks].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="space-y-4">
      <TextField
        control={control}
        label="Title"
        name={'title' as Path<T>}
        placeholder="Grace in Action"
        required
      />

      <UrlField
        control={control}
        label="Media URL"
        name={'mediaUrl' as Path<T>}
        placeholder="https://example.com/clip.mp4"
        required
      />

      <TextareaField
        control={control}
        description="Brief description of this clip"
        label="Description"
        name={'description' as Path<T>}
        placeholder="A powerful moment from..."
        rows={3}
      />

      <Controller
        control={control}
        name={'speakerId' as Path<T>}
        render={({ field }) => (
          <Field name="speakerId">
            <FieldLabel htmlFor="speakerId">Speaker (Optional)</FieldLabel>
            <Select
              items={[
                { label: 'None', value: '' },
                ...sortedSpeakers.map((s) => ({
                  label: getSpeakerName(s),
                  value: s._id,
                })),
              ]}
              name="speakerId"
              onValueChange={(v) => field.onChange(v === '' ? undefined : (v as SpeakerId))}
              value={(field.value as string) || ''}
            >
              <SelectTrigger id="speakerId">
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                <SelectItem value="">None</SelectItem>
                {sortedSpeakers.map((speaker) => (
                  <SelectItem key={speaker._id} value={speaker._id}>
                    {getSpeakerName(speaker)}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </Field>
        )}
      />

      <Controller
        control={control}
        name={'talkId' as Path<T>}
        render={({ field }) => (
          <Field name="talkId">
            <FieldLabel htmlFor="talkId">From Talk (Optional)</FieldLabel>
            <Select
              items={[
                { label: 'None', value: '' },
                ...sortedTalks.map((t) => ({
                  label: t.title,
                  value: t._id,
                })),
              ]}
              name="talkId"
              onValueChange={(v) => field.onChange(v === '' ? undefined : (v as TalkId))}
              value={(field.value as string) || ''}
            >
              <SelectTrigger id="talkId">
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                <SelectItem value="">None</SelectItem>
                {sortedTalks.map((talk) => (
                  <SelectItem key={talk._id} value={talk._id}>
                    {talk.title}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </Field>
        )}
      />

      <StatusField control={control} name={'status' as Path<T>} />
    </div>
  );
}
