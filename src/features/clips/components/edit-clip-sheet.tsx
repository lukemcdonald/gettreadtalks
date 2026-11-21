'use client';

import type { ClipFormData } from '../schemas/clip-form';
import type { ClipId } from '@/features/clips/types';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { TalkId, TalkListItem } from '@/features/talks/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';
import type { StatusType } from '@/lib/entities/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';

import { FormSheet } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { UnsavedStatusNotice } from '@/components/unsaved-status-notice';
import { updateClipAction } from '@/features/clips/actions/update-clip';
import { getUnsavedStatusPrefill } from '@/lib/entities/status-prefill';
import { setServerErrors } from '@/lib/forms/react-hook-form';
import { useStatusPrefillForm } from '@/lib/forms/use-status-prefill-form';

import { clipFormSchema } from '../schemas/clip-form';
import { ClipFormFields } from './clip-form-fields';

interface ClipData {
  _id: ClipId;
  description?: string;
  mediaUrl: string;
  speakerId?: SpeakerId;
  status?: StatusType;
  talkId?: TalkId;
  title: string;
}

interface EditClipSheetProps {
  clip: ClipData | null;
  onClipUpdated: (clipId: ClipId) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  speakers: SpeakerListItem[];
  statusPrefill?: StatusPrefill;
  talks: TalkListItem[];
}

export function EditClipSheet({
  clip,
  onClipUpdated,
  onOpenChange,
  open,
  speakers,
  statusPrefill,
  talks,
}: EditClipSheetProps) {
  const [isPending, startTransition] = useTransition();

  const savedStatus = clip?.status ?? 'backlog';
  const unsavedStatus = getUnsavedStatusPrefill(savedStatus, statusPrefill);
  const savedValues: ClipFormData = {
    description: clip?.description ?? '',
    mediaUrl: clip?.mediaUrl ?? '',
    speakerId: clip?.speakerId,
    status: savedStatus,
    talkId: clip?.talkId,
    title: clip?.title ?? '',
  };
  const displayedValues = unsavedStatus
    ? { ...savedValues, status: unsavedStatus }
    : savedValues;
  const form = useStatusPrefillForm(
    savedValues,
    displayedValues,
    unsavedStatus,
    {
      mode: 'onBlur',
      // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
      resolver: zodResolver(clipFormSchema as any),
    }
  );

  const handleSubmit = form.handleSubmit((data) => {
    if (!clip) {
      return;
    }

    startTransition(async () => {
      const result = await updateClipAction(data, clip._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      toastManager.add({ title: 'Clip updated', type: 'success' });
      onClipUpdated(clip._id);
      onOpenChange(false);
    });
  });

  if (!clip) {
    return null;
  }

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Save Changes"
      title="Edit Clip"
    >
      {unsavedStatus ? <UnsavedStatusNotice status={unsavedStatus} /> : null}
      <ClipFormFields
        control={form.control}
        speakers={speakers}
        talks={talks}
      />
    </FormSheet>
  );
}
