'use client';
import type { ReactNode } from 'react';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkId, TalkStatus } from '@/features/talks/types';

import { Controller, FormProvider } from 'react-hook-form';

import {
  Button,
  FeaturedField,
  Fieldset,
  FormError,
  NumberField,
  StatusField,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { CollectionSelectField } from '@/features/collections/components';
import { SpeakerField } from '@/features/speakers/components/speaker-field';
import { useTalkForm } from '@/features/talks/hooks';

interface TalkFormProps {
  actionsMenu?: (props: { isBusy: boolean }) => ReactNode;
  collections: Pick<Collection, '_id' | 'slug' | 'title'>[];
  initialData?: {
    collectionId?: CollectionId;
    collectionOrder?: number;
    description?: string;
    featured?: boolean;
    mediaUrl: string;
    scripture?: string;
    speakerId: SpeakerId;
    status?: TalkStatus;
    title: string;
  };
  mode?: 'create' | 'edit';
  speakerSlug?: string;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug' | 'imageUrl' | 'role'>[];
  talkId?: TalkId;
  talkSlug?: string;
}

export function TalkForm({
  actionsMenu,
  collections,
  initialData,
  mode = 'create',
  speakerSlug,
  speakers,
  talkId,
  talkSlug,
}: TalkFormProps) {
  const { form, isBusy, onError, onSubmit, setTalkStatus, submitLabel } = useTalkForm({
    collections,
    initialData,
    speakerSlug,
    speakers,
    talkId,
    talkSlug,
  });

  return (
    <FormProvider {...form}>
      <form
        className="flex w-full flex-col gap-4 space-y-6"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <FormError error={form.formState.errors.root} />

        <Fieldset className="max-w-none" disabled={isBusy}>
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
                  value={field.value}
                />
              )}
            />

            <NumberField control={form.control} label="Collection Order" name="collectionOrder" />

            <StatusField
              control={form.control}
              name="status"
              onChange={(value) => {
                setTalkStatus(value as TalkStatus);
              }}
            />

            <FeaturedField control={form.control} name="featured" />
          </div>
        </Fieldset>

        <div className="flex items-center gap-4">
          {actionsMenu ? (
            actionsMenu({ isBusy })
          ) : (
            <Button disabled={isBusy} type="submit">
              {submitLabel}
            </Button>
          )}
          {mode === 'edit' && (
            <Button
              disabled={isBusy}
              onClick={() => window.history.back()}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
