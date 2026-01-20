'use client';

import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { TalkId } from '@/features/talks/types';
import type { StatusType } from '@/lib/entities/types';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { slugify } from '@/convex/lib/utils';
import { createTalkAction, updateTalkAction } from '@/features/talks/actions';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { getSubmitButtonLabel, getTalkUrl } from '@/features/talks/utils';
import { useEntityStatus } from '@/lib/entities/hooks';
import { useFormStatus } from '@/lib/forms/hooks';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface UseTalkFormProps {
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
}

interface UseTalkFormReturn {
  form: ReturnType<typeof useForm<TalkFormData>>;
  isBusy: boolean;
  onError: SubmitErrorHandler<TalkFormData>;
  onSubmit: SubmitHandler<TalkFormData>;
  setTalkStatus: (status: StatusType) => void;
  submitLabel: string;
}

/**
 * Hook to manage talk form state and operations.
 * Handles form initialization and submission.
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

  const { isBusy: isFormBusy, setStatus: setFormStatus, status: formStatus } = useFormStatus();

  const { setStatus: setTalkStatus } = useEntityStatus(initialData?.status || 'backlog');

  const [isPending, startTransition] = useTransition();

  const form = useForm<TalkFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
    mode: 'onBlur',
    defaultValues: {
      collectionId: initialData?.collectionId,
      collectionOrder: initialData?.collectionOrder,
      description: initialData?.description ?? '',
      featured: initialData?.featured ?? false,
      mediaUrl: initialData?.mediaUrl ?? '',
      scripture: initialData?.scripture ?? '',
      speakerId: initialData?.speakerId,
      status: initialData?.status ?? 'backlog',
      title: initialData?.title ?? '',
    },
  });

  async function handleFormSubmit(values: TalkFormData) {
    setFormStatus(talkId ? 'updating' : 'creating');

    const result = talkId ? await updateTalkAction(values, talkId) : await createTalkAction(values);

    if (!result.success) {
      setFormStatus('idle');
      setServerErrors(form.setError, result.errors);
      return;
    }

    const selectedSpeaker = speakers.find((s) => s._id === values.speakerId);

    if (!selectedSpeaker) {
      setFormStatus('idle');
      form.setError('speakerId', {
        type: 'server',
        message: 'Speaker not found',
      });
      return;
    }

    const newSlug = slugify(values.title);
    const isEditingWithUnchangedTitle = talkId && newSlug === slugify(initialData?.title || '');
    const finalTalkSlug = isEditingWithUnchangedTitle ? (talkSlug ?? newSlug) : newSlug;
    const finalSpeakerSlug = speakerSlug ?? selectedSpeaker.slug;

    setFormStatus('idle');
    router.push(getTalkUrl(finalSpeakerSlug, finalTalkSlug));
  }

  const onSubmit: SubmitHandler<TalkFormData> = (values) => {
    startTransition(async () => {
      await handleFormSubmit(values);
    });
  };

  const onError: SubmitErrorHandler<TalkFormData> = () => {
    // Empty - form errors are displayed inline
  };

  const isBusy = isFormBusy || isPending;
  const submitLabel = getSubmitButtonLabel(formStatus, talkId);

  return {
    form,
    isBusy,
    onError,
    onSubmit,
    setTalkStatus,
    submitLabel,
  };
}
