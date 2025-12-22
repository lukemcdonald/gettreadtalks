'use client';
import type { StatusType } from '@/convex/lib/validators/shared';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks';

import { Controller, FormProvider } from 'react-hook-form';

import {
  Button,
  FeaturedField,
  Form,
  FormError,
  NumberField,
  StatusField,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { useTalkForm } from '@/features/talks/hooks';
import { CollectionSelectField } from './collection-select-field';
import { SpeakerField } from './speaker-field';

type TalkFormProps = {
  collections: Pick<Collection, '_id' | 'slug' | 'title'>[];
  initialData?: {
    collectionId?: CollectionId;
    collectionOrder?: number;
    description?: string;
    featured?: boolean;
    mediaUrl: string;
    scripture?: string;
    speakerId: SpeakerId;
    status?: StatusType;
    title: string;
  };
  speakerSlug?: string;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug' | 'imageUrl' | 'role'>[];
  talkId?: TalkId;
  talkSlug?: string;
};

export function TalkForm({
  collections,
  initialData,
  speakerSlug,
  speakers,
  talkId,
  talkSlug,
}: TalkFormProps) {
  const {
    archiveLabel,
    form,
    isArchived,
    isBusy,
    isDeleting,
    onArchiveToggle,
    onDelete,
    onError,
    onSubmit,
    setTalkStatus,
    submitLabel,
  } = useTalkForm({
    collections,
    initialData,
    speakerSlug,
    speakers,
    talkId,
    talkSlug,
  });

  return (
    <FormProvider {...form}>
      <Form className="space-y-6" noValidate onSubmit={form.handleSubmit(onSubmit, onError)}>
        <FormError error={form.formState.errors.root} />

        <div className="space-y-4">
          <TextField control={form.control} label="Title" name="title" required />

          <SpeakerField
            control={form.control}
            label="Speaker"
            name="speakerId"
            required
            speakers={speakers}
          />

          <UrlField control={form.control} label="Media URL" name="mediaUrl" required />

          <TextareaField control={form.control} label="Description" name="description" rows={4} />

          <TextField control={form.control} label="Scripture" name="scripture" />

          <Controller
            control={form.control}
            name="collectionId"
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

          <NumberField control={form.control} label="Collection Order" name="collectionOrder" />

          <StatusField
            control={form.control}
            name="status"
            onChange={(value) => {
              setTalkStatus(value as StatusType);
            }}
          />

          <FeaturedField control={form.control} name="featured" />
        </div>

        <div className="flex items-center gap-4">
          <Button disabled={isBusy} type="submit">
            {submitLabel}
          </Button>

          {Boolean(talkId) && (
            <>
              <Button
                disabled={isBusy}
                onClick={onArchiveToggle}
                type="button"
                variant={isArchived ? 'outline' : 'destructive'}
              >
                {archiveLabel}
              </Button>
              <Button disabled={isBusy} onClick={onDelete} type="button" variant="destructive">
                {isDeleting ? 'Deleting...' : 'Delete Talk'}
              </Button>
            </>
          )}
        </div>
      </Form>
    </FormProvider>
  );
}
