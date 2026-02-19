'use client';

import type { ClipId } from '@/features/clips/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkListItem } from '@/features/talks/types';
import type { ClipFormData } from '../schemas/clip-form';

import { useEffect, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { createClipAction } from '@/features/clips/actions/create-clip';
import { setServerErrors } from '@/lib/forms/react-hook-form';
import { clipFormSchema } from '../schemas/clip-form';
import { ClipFormFields } from './clip-form-fields';

interface CreateClipSheetProps {
  onClipCreated: (clipId: ClipId) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  speakers: SpeakerListItem[];
  talks: TalkListItem[];
}

export function CreateClipSheet({
  onClipCreated,
  onOpenChange,
  open,
  speakers,
  talks,
}: CreateClipSheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ClipFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4 compatibility with zodResolver
    resolver: zodResolver(clipFormSchema as any),
    mode: 'onBlur',
    defaultValues: {
      description: '',
      mediaUrl: '',
      speakerId: undefined,
      status: 'backlog',
      talkId: undefined,
      title: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await createClipAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onClipCreated(result.data.clipId);
      onOpenChange(false);
    });
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      pendingLabel="Creating..."
      submitLabel="Create Clip"
      title="Add New Clip"
    >
      <ClipFormFields control={form.control} speakers={speakers} talks={talks} />
    </FormSheet>
  );
}
