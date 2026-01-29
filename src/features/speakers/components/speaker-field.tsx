'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';

import {
  Button,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers/utils';
import { CreateSpeakerSheet } from './create-speaker-sheet';

interface SpeakerFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label?: string;
  name: FieldPath<T>;
  onSpeakerCreated?: (speakerId: SpeakerId) => void;
  required?: boolean;
  speakers: SpeakerListItem[];
}

// TODO: Consider ways to split this component up into smaller components if it makes sense. It is getting pretty big.s

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
  const [localSpeakers, setLocalSpeakers] = useState<SpeakerListItem[]>(initialSpeakers);

  const sortedSpeakers = [...localSpeakers].sort((a, b) => {
    const nameA = getSpeakerName(a).toLowerCase();
    const nameB = getSpeakerName(b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleSpeakerCreated = (speakerId: SpeakerId, newSpeaker: SpeakerListItem) => {
          setLocalSpeakers((prev) => [...prev, newSpeaker]);
          field.onChange(speakerId);
          if (onSpeakerCreated) {
            onSpeakerCreated(speakerId);
          }
          setIsSheetOpen(false);
        };

        return (
          <>
            <Field invalid={fieldState.invalid} name={field.name}>
              <FieldLabel htmlFor={field.name} required={required}>
                {label}
              </FieldLabel>
              {!!description && <FieldDescription>{description}</FieldDescription>}

              <Combobox
                filter={(itemValue: SpeakerId, query: string) => {
                  const speaker = sortedSpeakers.find((s) => s._id === itemValue);
                  if (!speaker) {
                    return false;
                  }
                  const fullName = getSpeakerName(speaker).toLowerCase();
                  return fullName.includes(query.toLowerCase());
                }}
                items={sortedSpeakers.map((s) => s._id)}
                itemToStringLabel={(itemValue: SpeakerId) => {
                  const speaker = sortedSpeakers.find((s) => s._id === itemValue);
                  return speaker ? getSpeakerName(speaker) : '';
                }}
                onValueChange={(selected: SpeakerId | null) => {
                  field.onChange(selected ?? '');
                }}
                value={field.value || null}
              >
                <ComboboxInput
                  aria-invalid={fieldState.invalid}
                  id={field.name}
                  placeholder="Search speakers..."
                  showClear
                />

                <ComboboxPopup>
                  <ComboboxEmpty>
                    <Button
                      className="w-full justify-start"
                      onClick={() => setIsSheetOpen(true)}
                      type="button"
                      variant="ghost"
                    >
                      <PlusIcon className="size-4" />
                      <span>Add New Speaker</span>
                    </Button>
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(itemValue: SpeakerId) => {
                      const speaker = sortedSpeakers.find((s) => s._id === itemValue);
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
                    }}
                  </ComboboxList>
                </ComboboxPopup>
              </Combobox>

              {!!fieldState.error?.message && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>

            <CreateSpeakerSheet
              onOpenChange={setIsSheetOpen}
              onSpeakerCreated={handleSpeakerCreated}
              open={isSheetOpen}
            />
          </>
        );
      }}
    />
  );
}
