'use client';
import type { StatusType } from '@/convex/lib/validators/shared';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks';

import { Controller, FormProvider } from 'react-hook-form';

import {
  Button,
  Checkbox,
  Field,
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
    <FormProvider {...form}>
      <Form className="space-y-6" noValidate onSubmit={form.handleSubmit(onSubmit, onError)}>
        <FormError error={form.formState.errors.root} />

        <div className="space-y-4">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field
                dirty={fieldState.isDirty}
                invalid={fieldState.invalid}
                name={field.name}
                touched={fieldState.isTouched}
              >
                <FieldLabel>Title</FieldLabel>
                <Input aria-invalid={fieldState.invalid} required type="text" {...field} />
                <FieldError error={fieldState.error} />
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
              <Field
                dirty={fieldState.isDirty}
                invalid={fieldState.invalid}
                name={field.name}
                touched={fieldState.isTouched}
              >
                <FieldLabel>Media URL</FieldLabel>
                <Input aria-invalid={fieldState.invalid} required type="url" {...field} />
                <FieldError error={fieldState.error} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <Field name={field.name}>
                <FieldLabel>Description</FieldLabel>
                <Textarea rows={4} {...field} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="scripture"
            render={({ field }) => (
              <Field name={field.name}>
                <FieldLabel>Scripture</FieldLabel>
                <Input type="text" {...field} />
              </Field>
            )}
          />

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

          <Controller
            control={form.control}
            name="collectionOrder"
            render={({ field, fieldState }) => {
              const { onChange, value, ...inputProps } = field;
              return (
                <Field
                  dirty={fieldState.isDirty}
                  invalid={fieldState.invalid}
                  name={field.name}
                  touched={fieldState.isTouched}
                >
                  <FieldLabel>Collection Order</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => onChange(e.target.valueAsNumber || undefined)}
                    type="number"
                    value={value ?? ''}
                    {...inputProps}
                  />
                  <FieldError error={fieldState.error} />
                </Field>
              );
            }}
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
              <Field name={field.name}>
                <FieldLabel>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                  Featured
                </FieldLabel>
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
    </FormProvider>
  );
}
