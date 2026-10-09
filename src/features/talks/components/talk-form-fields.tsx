'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { TalkStatus } from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import {
  FeaturedField,
  NumberField,
  StatusField,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { CollectionSelectField } from '@/features/collections/components/collection-select-field';
import { SpeakerField } from '@/features/speakers/components/speaker-field';
import { TopicField } from '@/features/topics/components/topic-field';

interface TalkCollectionFieldsProps {
  collections: CollectionListItem[];
  control: Control<TalkFormData>;
  setValue: UseFormSetValue<TalkFormData>;
}

interface TalkFormFieldsProps {
  collections: CollectionListItem[];
  control: Control<TalkFormData>;
  mode?: 'create' | 'edit';
  onSpeakerCreated?: (speakerId: SpeakerId) => void;
  onStatusChange?: (status: TalkStatus) => void;
  setValue: UseFormSetValue<TalkFormData>;
  speakers: SpeakerListItem[];
  topics: TopicListItem[];
}

function TalkCollectionFields({
  collections,
  control,
  setValue,
}: TalkCollectionFieldsProps) {
  const [collectionId, collectionOrder] = useWatch({
    control,
    name: ['collectionId', 'collectionOrder'],
  });

  useEffect(() => {
    if (collectionId || collectionOrder === undefined) {
      return;
    }

    setValue('collectionOrder', undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [collectionId, collectionOrder, setValue]);

  return (
    <>
      <Controller
        control={control}
        name="collectionId"
        render={({ field }) => (
          <CollectionSelectField
            collections={collections}
            onValueChange={(value) => {
              field.onChange(value);
            }}
            value={field.value}
          />
        )}
      />
      {collectionId ? (
        <NumberField
          control={control}
          label="Collection Order"
          name="collectionOrder"
        />
      ) : null}
    </>
  );
}

export function TalkFormFields({
  collections,
  control,
  mode = 'create',
  onSpeakerCreated,
  onStatusChange,
  setValue,
  speakers,
  topics,
}: TalkFormFieldsProps) {
  return (
    <div className="space-y-4">
      <TextField
        control={control}
        label="Title"
        name="title"
        placeholder="The Gospel of Grace"
        required
      />

      {mode === 'edit' && (
        <TextField
          control={control}
          description="Changing this will change the talk URL"
          label="Slug"
          name="slug"
        />
      )}

      <SpeakerField
        control={control}
        label="Speaker"
        name="speakerId"
        onSpeakerCreated={onSpeakerCreated}
        required
        speakers={speakers}
      />

      <UrlField
        control={control}
        label="Media URL"
        name="mediaUrl"
        placeholder="https://example.com/audio.mp3"
        required
      />

      <TextareaField
        control={control}
        label="Description"
        name="description"
        placeholder="A message about..."
        rows={3}
      />

      <TextField
        control={control}
        label="Scripture"
        name="scripture"
        placeholder="Romans 8:28"
      />

      <TopicField control={control} name="topicIds" topics={topics} />

      <TalkCollectionFields
        collections={collections}
        control={control}
        setValue={setValue}
      />

      <StatusField control={control} name="status" onChange={onStatusChange} />

      <FeaturedField control={control} name="featured" />
    </div>
  );
}
