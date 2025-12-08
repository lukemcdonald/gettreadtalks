'use client';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form';

import { slugify } from '@/convex/lib/utils';
import { createTalkAction, updateTalkAction } from '@/features/talks/actions';
import { useArchiveTalk, useDestroyTalk, useUpdateTalk } from '@/features/talks/hooks';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { getArchiveButtonLabel, getSubmitButtonLabel, getTalkUrl } from '@/features/talks/utils';
import { useEntityStatus } from '@/lib/entities/hooks';
import { useFormStatus } from '@/lib/forms/hooks';
import { setServerErrors } from '@/lib/forms/react-hook-form';

type UseTalkFormProps = {
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

type UseTalkFormReturn = {
  archiveLabel: string;
  form: ReturnType<typeof useForm<TalkFormData>>;
  isArchived: boolean;
  isBusy: boolean;
  isDeleting: boolean;
  onArchiveToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  onError: SubmitErrorHandler<TalkFormData>;
  onSubmit: SubmitHandler<TalkFormData>;
  setTalkStatus: (status: StatusType) => void;
  submitLabel: string;
  talkStatus: StatusType;
};

/**
 * Hook to manage talk form state and operations.
 * Handles form initialization, submission, archiving, and deletion.
 *
 * @param props - Form configuration and initial data
 * @returns Form instance and handlers
 */
export function useTalkForm({
  initialData,
  speakerSlug,
  speakers,
  talkId,
  talkSlug,
}: UseTalkFormProps): UseTalkFormReturn {
  const router = useRouter();
  const archiveTalk = useArchiveTalk();
  const destroyTalk = useDestroyTalk();
  const updateTalk = useUpdateTalk();

  const {
    isBusy: isFormBusy,
    isDeleting,
    setStatus: setFormStatus,
    status: formStatus,
  } = useFormStatus();

  const {
    isArchived,
    setStatus: setTalkStatus,
    status: talkStatus,
  } = useEntityStatus(initialData?.status || 'backlog');

  const [isPending, startTransition] = useTransition();

  const form = useForm<TalkFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
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
      setFormStatus(talkId ? 'updating' : 'creating');

      const result = talkId
        ? await updateTalkAction(values, talkId)
        : await createTalkAction(values);

      // Handle errors early and return
      if (!result.success) {
        setFormStatus('idle');
        setServerErrors(form.setError, result.errors);
        return;
      }

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

      setFormStatus('idle');
      router.push(getTalkUrl(finalSpeakerSlug, finalTalkSlug));
    });
  };

  const onError: SubmitErrorHandler<TalkFormData> = () => {
    // TODO: Add eventing
  };

  const onArchiveToggle = async () => {
    if (!talkId) {
      return;
    }

    // isArchived is already available from useEntityStatus
    const confirmMessage = isArchived
      ? 'Are you sure you want to unarchive this talk?'
      : 'Are you sure you want to archive this talk?';

    // biome-ignore lint/suspicious/noAlert: confirm dialog
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setFormStatus(isArchived ? 'unarchiving' : 'archiving');

    try {
      if (isArchived) {
        await updateTalk.mutateAsync({ id: talkId, status: 'backlog' });
        setTalkStatus('backlog');
      } else {
        await archiveTalk.mutateAsync({ id: talkId });
        setTalkStatus('archived');
      }
      router.push('/talks');
    } catch (error) {
      setFormStatus('idle');
    }
  };

  const onDelete = async () => {
    if (!talkId) {
      return;
    }

    // biome-ignore lint/suspicious/noAlert: confirm dialog
    if (!window.confirm('Are you sure you want to permanently delete this talk?')) {
      return;
    }

    setFormStatus('deleting');

    try {
      await destroyTalk.mutateAsync({ id: talkId });
    } catch (error) {
      setFormStatus('idle');
    }
  };

  const isBusy = isFormBusy || isPending;

  const archiveLabel = getArchiveButtonLabel(formStatus, talkStatus);
  const submitLabel = getSubmitButtonLabel(formStatus, talkId);

  return {
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
    talkStatus,
  };
}
