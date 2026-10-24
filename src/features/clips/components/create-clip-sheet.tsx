'use client';

import type { ClipFormData } from '../schemas/clip-form';
import type { ClipId } from '@/features/clips/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkListItem } from '@/features/talks/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { createClipAction } from '@/features/clips/actions/create-clip';
import { useCreateFormSheet } from '@/lib/forms/use-create-form-sheet';

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
  const form = useForm<ClipFormData>({
    defaultValues: {
      description: '',
      mediaUrl: '',
      speakerId: undefined,
      status: 'backlog',
      talkId: undefined,
      title: '',
    },
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(clipFormSchema as any),
  });

  const { handleSubmit, isPending } = useCreateFormSheet({
    form,
    onOpenChange,
    onSuccess: (data) => {
      toastManager.add({ title: 'Clip created', type: 'success' });
      onClipCreated(data.clipId);
    },
    open,
    submit: createClipAction,
  });

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Create Clip"
      title="Add New Clip"
    >
      <ClipFormFields
        control={form.control}
        speakers={speakers}
        talks={talks}
      />
    </FormSheet>
  );
}
