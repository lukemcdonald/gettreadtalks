'use client';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks';

import { Controller } from 'react-hook-form';

import {
  Button,
  Checkbox,
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  FormError,
  Input,
  Textarea,
} from '@/components/ui';
import { useTalkForm } from '@/features/talks/hooks';
import { CollectionSelectField } from './collection-select-field';
import { SpeakerSelectField } from './speaker-select-field';
import { StatusSelectField } from './status-select-field';

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
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'>[];
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
    <Form className="space-y-6" form={form} onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FormError error={form.formState.errors.root} />

      <div className="space-y-4">
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Title</FieldLabel>
              <FieldControl error={fieldState.error} required type="text" {...field} />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="speakerId"
          render={({ field, fieldState }) => (
            <SpeakerSelectField
              error={fieldState.error}
              onValueChange={field.onChange}
              speakers={speakers}
              value={field.value as SpeakerId}
            />
          )}
        />

        <Controller
          control={form.control}
          name="mediaUrl"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Media URL</FieldLabel>
              <FieldControl error={fieldState.error} required type="url" {...field} />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldControl render={(props) => <Textarea {...props} {...field} rows={4} />} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="scripture"
          render={({ field }) => (
            <Field>
              <FieldLabel>Scripture</FieldLabel>
              <FieldControl {...field} type="text" />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="collectionId"
          render={({ field }) => (
            <CollectionSelectField
              collections={collections}
              onValueChange={(value) => field.onChange(value || undefined)}
              value={(field.value as CollectionId | undefined) || ''}
            />
          )}
        />

        <Controller
          control={form.control}
          name="collectionOrder"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Collection Order</FieldLabel>
              <FieldControl
                {...field}
                error={fieldState.error}
                onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                type="number"
                value={field.value ?? ''}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <StatusSelectField
              onChange={(value) => {
                field.onChange(value);
                setTalkStatus(value);
              }}
              value={field.value}
            />
          )}
        />

        <Controller
          control={form.control}
          name="featured"
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={field.value}
                  id="featured"
                  name="featured"
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <FieldLabel htmlFor="featured">Featured</FieldLabel>
              </div>
            </Field>
          )}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button disabled={isBusy} type="submit">
          {submitLabel}
        </Button>

        {talkId && (
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
  );
}
