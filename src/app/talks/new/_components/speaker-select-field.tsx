import type { FieldError } from 'react-hook-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import {
  Field,
  type FieldError,
  FieldLabel,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { getSpeakerName } from '@/features/speakers';

type SpeakerSelectFieldProps = {
  defaultValue?: SpeakerId | null;
  error?: FieldError;
  onValueChange?: (value: SpeakerId) => void;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName'>[];
  value?: SpeakerId;
};

export function SpeakerSelectField({
  defaultValue,
  error,
  onValueChange,
  speakers,
  value,
}: SpeakerSelectFieldProps) {
  const items = speakers.map((speaker) => ({
    label: getSpeakerName(speaker),
    value: speaker._id,
  }));

  return (
    <Field>
      <FieldLabel htmlFor="speakerId" required>
        Speaker
      </FieldLabel>
      <Select
        defaultValue={defaultValue}
        items={items}
        name="speakerId"
        onValueChange={(v) => onValueChange?.(v as SpeakerId)}
        required
        value={value}
      >
        <SelectTrigger aria-invalid={error ? 'true' : undefined} id="speakerId">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {speakers.map((speaker) => (
            <SelectItem key={speaker._id} value={speaker._id}>
              {speaker.firstName} {speaker.lastName}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <FieldError errors={error ? [error] : undefined} />
    </Field>
  );
}
