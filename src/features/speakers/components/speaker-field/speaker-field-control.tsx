'use client';

import type { SpeakerFieldValue } from './speaker-field-utils';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { Dispatch, SetStateAction } from 'react';
import type { ControllerFieldState } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui';

import { CreateSpeakerSheet } from '../create-speaker-sheet';
import { SpeakerCombobox } from './speaker-combobox';

interface SpeakerFieldControlProps {
  description?: string;
  field: SpeakerFieldValue;
  fieldState: ControllerFieldState;
  isSheetOpen: boolean;
  label: string;
  onSpeakerCreated?: (speakerId: SpeakerId) => void;
  required?: boolean;
  setIsSheetOpen: (open: boolean) => void;
  setLocalSpeakers: Dispatch<SetStateAction<SpeakerListItem[]>>;
  speakers: SpeakerListItem[];
}

export function SpeakerFieldControl({
  description,
  field,
  fieldState,
  isSheetOpen,
  label,
  onSpeakerCreated,
  required,
  setIsSheetOpen,
  setLocalSpeakers,
  speakers,
}: SpeakerFieldControlProps) {
  function handleSpeakerCreated(
    speakerId: SpeakerId,
    newSpeaker: SpeakerListItem
  ) {
    setLocalSpeakers((previous) => [...previous, newSpeaker]);
    field.onChange(speakerId);
    if (onSpeakerCreated) {
      onSpeakerCreated(speakerId);
    }
    setIsSheetOpen(false);
  }

  return (
    <>
      <Field invalid={fieldState.invalid} name={field.name}>
        <FieldLabel htmlFor={field.name} required={required}>
          {label}
        </FieldLabel>
        {!!description && <FieldDescription>{description}</FieldDescription>}
        <SpeakerCombobox
          field={field}
          fieldState={fieldState}
          onAddSpeaker={() => setIsSheetOpen(true)}
          speakers={speakers}
        />
        {!!fieldState.error?.message && (
          <FieldError match>{fieldState.error.message}</FieldError>
        )}
      </Field>
      <CreateSpeakerSheet
        onOpenChange={setIsSheetOpen}
        onSpeakerCreated={handleSpeakerCreated}
        open={isSheetOpen}
      />
    </>
  );
}
