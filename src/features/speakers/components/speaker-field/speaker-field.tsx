'use client';

import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { SpeakerFieldControl } from './speaker-field-control';
import { getSortedSpeakers } from './speaker-field-utils';

interface SpeakerFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label?: string;
  name: FieldPath<T>;
  onSpeakerCreated?: (speakerId: SpeakerId) => void;
  required?: boolean;
  speakers: SpeakerListItem[];
}

export function SpeakerField<T extends FieldValues>({
  control,
  description,
  label = 'Speaker',
  name,
  onSpeakerCreated,
  required,
  speakers: initialSpeakers,
}: SpeakerFieldProps<T>) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [localSpeakers, setLocalSpeakers] =
    useState<SpeakerListItem[]>(initialSpeakers);
  const sortedSpeakers = getSortedSpeakers(localSpeakers);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <SpeakerFieldControl
          description={description}
          field={field}
          fieldState={fieldState}
          isSheetOpen={isSheetOpen}
          label={label}
          onSpeakerCreated={onSpeakerCreated}
          required={required}
          setIsSheetOpen={setIsSheetOpen}
          setLocalSpeakers={setLocalSpeakers}
          speakers={sortedSpeakers}
        />
      )}
    />
  );
}
