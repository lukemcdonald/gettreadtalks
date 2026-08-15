'use client';

import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { TalkFormInitialData, TalkId } from '@/features/talks/types';
import type { StatusType } from '@/lib/entities/types';
import type { FormStatus } from '@/lib/forms/types';
import type {
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { slugify } from '@/convex/lib/utils';
import { createTalkAction } from '@/features/talks/actions/create-talk';
import { updateTalkAction } from '@/features/talks/actions/update-talk';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { getSubmitButtonLabel, getTalkUrl } from '@/features/talks/utils';
import { useEntityStatus } from '@/lib/entities/hooks';
import { useFormStatus } from '@/lib/forms/hooks';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface UseTalkFormProps {
  collections: Pick<Collection, '_id' | 'slug' | 'title'>[];
  initialData?: Partial<TalkFormInitialData>;
  speakerSlug?: string;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'>[];
  talkId?: TalkId;
  talkSlug?: string;
}

interface UrlChangeInfo {
  newUrl: string;
  oldUrl: string;
}

interface UseTalkFormReturn {
  confirmUrlChange: () => void;
  form: ReturnType<typeof useForm<TalkFormData>>;
  isBusy: boolean;
  onError: SubmitErrorHandler<TalkFormData>;
  onSubmit: SubmitHandler<TalkFormData>;
  setTalkStatus: (status: StatusType) => void;
  setUrlChangeOpen: (open: boolean) => void;
  submitLabel: string;
  urlChange: UrlChangeInfo | null;
  urlChangeOpen: boolean;
}

type TalkFormSpeaker = Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'>;

function getTalkFormDefaultValues(
  initialData?: Partial<TalkFormInitialData>
): TalkFormData {
  return {
    collectionId: initialData?.collectionId,
    collectionOrder: initialData?.collectionOrder,
    description: initialData?.description ?? '',
    featured: initialData?.featured ?? false,
    mediaUrl: initialData?.mediaUrl ?? '',
    scripture: initialData?.scripture ?? '',
    slug: initialData?.slug ?? '',
    speakerId: initialData?.speakerId ?? ('' as TalkFormData['speakerId']),
    status: initialData?.status ?? 'backlog',
    title: initialData?.title ?? '',
  };
}

function getUrlChangeInfo({
  initialData,
  speakerSlug,
  speakers,
  talkId,
  talkSlug,
  values,
}: {
  initialData?: Partial<TalkFormInitialData>;
  speakerSlug?: string;
  speakers: TalkFormSpeaker[];
  talkId?: TalkId;
  talkSlug?: string;
  values: TalkFormData;
}): UrlChangeInfo | null {
  if (!talkId || initialData?.status !== 'published') {
    return null;
  }

  const initialSpeaker = speakers.find((s) => s._id === initialData?.speakerId);
  const newSpeaker = speakers.find((s) => s._id === values.speakerId);
  const oldSpeakerSlug = speakerSlug ?? initialSpeaker?.slug ?? '';
  const newSpeakerSlug = newSpeaker?.slug ?? oldSpeakerSlug;

  const oldTalkSlug = talkSlug ?? initialData?.slug ?? '';
  const newTalkSlug = values.slug ? slugify(values.slug) : oldTalkSlug;

  const slugChanged = newTalkSlug !== oldTalkSlug;
  const speakerChanged = values.speakerId !== initialData?.speakerId;

  if (!(slugChanged || speakerChanged)) {
    return null;
  }

  return {
    newUrl: getTalkUrl(newSpeakerSlug, newTalkSlug),
    oldUrl: getTalkUrl(oldSpeakerSlug, oldTalkSlug),
  };
}

function handleTalkFormError(): void {
  // Form errors are displayed inline
}

async function submitTalkForm({
  form,
  router,
  setFormStatus,
  speakerSlug,
  speakers,
  talkId,
  talkSlug,
  values,
}: {
  form: UseFormReturn<TalkFormData>;
  router: ReturnType<typeof useRouter>;
  setFormStatus: (status: FormStatus) => void;
  speakerSlug?: string;
  speakers: TalkFormSpeaker[];
  talkId?: TalkId;
  talkSlug?: string;
  values: TalkFormData;
}): Promise<void> {
  setFormStatus(talkId ? 'updating' : 'creating');

  const result = talkId
    ? await updateTalkAction(values, talkId)
    : await createTalkAction(values);

  if (!result.success) {
    setFormStatus('idle');
    setServerErrors(form.setError, result.errors);
    return;
  }

  const selectedSpeaker = speakers.find((s) => s._id === values.speakerId);

  if (!selectedSpeaker) {
    setFormStatus('idle');
    form.setError('speakerId', {
      message: 'Speaker not found',
      type: 'server',
    });
    return;
  }

  const finalTalkSlug = talkId
    ? ((values.slug ? slugify(values.slug) : talkSlug) ?? slugify(values.title))
    : slugify(values.title);
  const finalSpeakerSlug = speakerSlug ?? selectedSpeaker.slug;

  setFormStatus('idle');
  router.push(getTalkUrl(finalSpeakerSlug, finalTalkSlug));
}

export function useTalkForm({
  initialData,
  speakerSlug,
  speakers,
  talkId,
  talkSlug,
}: UseTalkFormProps): UseTalkFormReturn {
  const router = useRouter();

  const {
    isBusy: isFormBusy,
    setStatus: setFormStatus,
    status: formStatus,
  } = useFormStatus();

  const { setStatus: setTalkStatus } = useEntityStatus(
    initialData?.status || 'backlog'
  );

  const [isPending, startTransition] = useTransition();

  const [pendingValues, setPendingValues] = useState<TalkFormData | null>(null);
  const [urlChange, setUrlChange] = useState<UrlChangeInfo | null>(null);
  const [urlChangeOpen, setUrlChangeOpen] = useState(false);

  const form = useForm<TalkFormData>({
    defaultValues: getTalkFormDefaultValues(initialData),
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
  });

  const onSubmit: SubmitHandler<TalkFormData> = (values) => {
    const change = getUrlChangeInfo({
      initialData,
      speakerSlug,
      speakers,
      talkId,
      talkSlug,
      values,
    });

    if (change) {
      setPendingValues(values);
      setUrlChange(change);
      setUrlChangeOpen(true);
      return;
    }

    startTransition(async () => {
      await submitTalkForm({
        form,
        router,
        setFormStatus,
        speakerSlug,
        speakers,
        talkId,
        talkSlug,
        values,
      });
    });
  };

  function confirmUrlChange() {
    if (!pendingValues) {
      return;
    }

    const values = pendingValues;
    setPendingValues(null);
    setUrlChange(null);
    setUrlChangeOpen(false);

    startTransition(async () => {
      await submitTalkForm({
        form,
        router,
        setFormStatus,
        speakerSlug,
        speakers,
        talkId,
        talkSlug,
        values,
      });
    });
  }

  const isBusy = isFormBusy || isPending;
  const submitLabel = getSubmitButtonLabel(formStatus, talkId);

  return {
    confirmUrlChange,
    form,
    isBusy,
    onError: handleTalkFormError,
    onSubmit,
    setTalkStatus,
    setUrlChangeOpen,
    submitLabel,
    urlChange,
    urlChangeOpen,
  };
}
