'use client';

import type { Control, FieldValues, Path } from 'react-hook-form';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkStatus } from '@/features/talks/types';

import { Controller } from 'react-hook-form';

import {
  FeaturedField,
  NumberField,
  StatusField,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { CollectionSelectField } from '@/features/collections/components';
import { SpeakerField } from '@/features/speakers/components/speaker-field';

type SpeakerListItem = Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'imageUrl' | 'role'>;
type CollectionListItem = Pick<Collection, '_id' | 'slug' | 'title'>;

interface TalkFormFieldsProps<T extends FieldValues> {
  collections: CollectionListItem[];
  control: Control<T>;
  onSpeakerCreated?: (speakerId: SpeakerId) => void;
  onStatusChange?: (status: TalkStatus) => void;
  speakers: SpeakerListItem[];
}

export function TalkFormFields<T extends FieldValues>({
  collections,
  control,
  onSpeakerCreated,
  onStatusChange,
  speakers,
}: TalkFormFieldsProps<T>) {
  return (
    <div className="space-y-4">
      <TextField
        control={control}
        label="Title"
        name={'title' as Path<T>}
        placeholder="The Gospel of Grace"
        required
      />

      <SpeakerField
        control={control}
        label="Speaker"
        name={'speakerId' as Path<T>}
        onSpeakerCreated={onSpeakerCreated}
        required
        speakers={speakers}
      />

      <UrlField
        control={control}
        label="Media URL"
        name={'mediaUrl' as Path<T>}
        placeholder="https://example.com/audio.mp3"
        required
      />

      <TextareaField
        control={control}
        label="Description"
        name={'description' as Path<T>}
        placeholder="A message about..."
        rows={3}
      />

      <TextField
        control={control}
        label="Scripture"
        name={'scripture' as Path<T>}
        placeholder="Romans 8:28"
      />

      <Controller
        control={control}
        name={'collectionId' as Path<T>}
        render={({ field }) => (
          <CollectionSelectField
            collections={collections}
            onValueChange={(value) => {
              field.onChange(value === '' ? undefined : (value as CollectionId));
            }}
            value={field.value as CollectionId | undefined}
          />
        )}
      />

      <NumberField control={control} label="Collection Order" name={'collectionOrder' as Path<T>} />

      <StatusField
        control={control}
        name={'status' as Path<T>}
        onChange={(value) => {
          if (onStatusChange) {
            onStatusChange(value as TalkStatus);
          }
        }}
      />

      <FeaturedField control={control} name={'featured' as Path<T>} />
    </div>
  );
}
