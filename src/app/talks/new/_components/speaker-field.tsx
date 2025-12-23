'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { SpeakerAvatar } from '@/components/speaker-avatar';
import {
  Button,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui';
import { getSpeakerName } from '@/features/speakers';
import { CreateSpeakerDialog } from './create-speaker-dialog';

type SpeakerFieldProps<T extends FieldValues> = {
  control: Control<T>;
  description?: string;
  label?: string;
  name: FieldPath<T>;
  onSpeakerCreated?: (speakerId: SpeakerId) => void;
  required?: boolean;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'imageUrl' | 'role'>[];
};

export function SpeakerField<T extends FieldValues>({
  control,
  description,
  label = 'Speaker',
  name,
  onSpeakerCreated,
  required,
  speakers,
}: SpeakerFieldProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleSpeakerCreated = (speakerId: SpeakerId) => {
          field.onChange(speakerId);
          if (onSpeakerCreated) {
            onSpeakerCreated(speakerId);
          }
          setIsDialogOpen(false);
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
                  const speaker = speakers.find((s) => s._id === itemValue);
                  if (!speaker) {
                    return false;
                  }
                  const fullName = getSpeakerName(speaker).toLowerCase();
                  return fullName.includes(query.toLowerCase());
                }}
                items={speakers.map((s) => s._id)}
                itemToStringLabel={(itemValue: SpeakerId) => {
                  const speaker = speakers.find((s) => s._id === itemValue);
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
                      onClick={() => {
                        setIsDialogOpen(true);
                      }}
                      type="button"
                      variant="ghost"
                    >
                      <PlusIcon className="size-4" />
                      <span>Add New Speaker</span>
                    </Button>
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(itemValue: SpeakerId) => {
                      const speaker = speakers.find((s) => s._id === itemValue);
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

            <CreateSpeakerDialog
              onOpenChange={setIsDialogOpen}
              onSpeakerCreated={handleSpeakerCreated}
              open={isDialogOpen}
            />
          </>
        );
      }}
    />
  );
}
