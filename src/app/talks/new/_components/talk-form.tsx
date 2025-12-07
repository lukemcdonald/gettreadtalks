'use client';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';

import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldControl, FieldLabel } from '@/components/ui/field';
import { FieldMessage } from '@/components/ui/field-message';
import { Form } from '@/components/ui/form';
import { FormMessage } from '@/components/ui/form-message';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/convex/lib/utils';
import { createTalkAction, updateTalkAction } from '@/features/talks/actions';
import { useArchiveTalk, useUpdateTalk } from '@/features/talks/hooks';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { getTalkUrl } from '@/features/talks/utils';
import { setServerErrors } from '@/lib/forms/react-hook-form';
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
  const router = useRouter();
  const archiveTalk = useArchiveTalk();
  const updateTalk = useUpdateTalk();

  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<StatusType>(initialData?.status || 'backlog');
  const [isPending, startTransition] = useTransition();

  // React Hook Form setup
  // Note: zodResolver works with Zod 4 when using type assertion
  const form = useForm<TalkFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any), // Type assertion needed for Zod 4 compatibility
    mode: 'onBlur',
    defaultValues: {
      collectionId: initialData?.collectionId,
      collectionOrder: initialData?.collectionOrder,
      description: initialData?.description,
      featured: initialData?.featured ?? false,
      mediaUrl: initialData?.mediaUrl ?? '',
      scripture: initialData?.scripture,
      speakerId: initialData?.speakerId ?? ('' as SpeakerId),
      status: initialData?.status ?? 'backlog',
      title: initialData?.title ?? '',
    },
  });

  const onSubmit: SubmitHandler<TalkFormData> = (values) => {
    // biome-ignore lint/complexity: its fine
    startTransition(async () => {
      const result = talkId
        ? await updateTalkAction(values, talkId)
        : await createTalkAction(values);

      // Handle errors early and return
      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      // Handle successful submission
      const selectedSpeaker = speakers.find((s) => s._id === values.speakerId);

      if (!selectedSpeaker) {
        form.setError('speakerId', {
          type: 'server',
          message: 'Speaker not found',
        });
        return;
      }

      // Determine talk slug
      const newSlug = slugify(values.title);
      let finalTalkSlug = newSlug;

      if (talkId) {
        const titleUnchanged = newSlug === slugify(initialData?.title || '');
        finalTalkSlug = titleUnchanged ? (talkSlug ?? newSlug) : newSlug;
      }

      // Determine speaker slug
      const finalSpeakerSlug = talkId
        ? (speakerSlug ?? selectedSpeaker.slug)
        : selectedSpeaker.slug;

      // Redirect to talk page
      router.push(getTalkUrl(finalSpeakerSlug, finalTalkSlug));
    });
  };

  const onError: SubmitErrorHandler<TalkFormData> = () => {
    // Validation failed - errors are automatically set in form.formState.errors
    // and displayed via FieldMessage component
  };

  const handleArchiveToggle = async () => {
    if (!talkId) {
      return;
    }

    const isArchived = status === 'archived';
    const action = isArchived ? 'unarchive' : 'archive';
    const confirmMessage = isArchived
      ? 'Are you sure you want to unarchive this talk?'
      : 'Are you sure you want to archive this talk?';

    // biome-ignore lint/suspicious/noAlert: confirm dialog
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      if (isArchived) {
        await updateTalk.mutateAsync({ id: talkId, status: 'backlog' });
        setStatus('backlog');
      } else {
        await archiveTalk.mutateAsync({ id: talkId });
        setStatus('archived');
      }
      router.push('/talks');
    } catch (error) {
      console.error(`Failed to ${action} talk:`, error);
      setIsDeleting(false);
    }
  };

  const isLoading = isPending || updateTalk.isLoading;

  const getSubmitButtonText = () => {
    if (isLoading) {
      return 'Saving...';
    }

    if (talkId) {
      return 'Update Talk';
    }

    return 'Create Talk';
  };

  const getArchiveButtonText = () => {
    if (isDeleting) {
      return status === 'archived' ? 'Unarchiving...' : 'Archiving...';
    }

    return status === 'archived' ? 'Unarchive Talk' : 'Archive Talk';
  };

  return (
    <Form className="space-y-6" form={form} onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FormMessage error={form.formState.errors.root} />

      <div className="space-y-4">
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel required>Title</FieldLabel>
              <FieldControl error={fieldState.error} required type="text" {...field} />
              <FieldMessage error={fieldState.error} />
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
              <FieldMessage error={fieldState.error} />
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
              <FieldMessage error={fieldState.error} />
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
                setStatus(value);
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
        <Button disabled={isLoading} type="submit">
          {getSubmitButtonText()}
        </Button>

        {talkId && (
          <Button
            disabled={isDeleting || isLoading}
            onClick={handleArchiveToggle}
            type="button"
            variant={status === 'archived' ? 'outline' : 'destructive'}
          >
            {getArchiveButtonText()}
          </Button>
        )}
      </div>
    </Form>
  );
}
