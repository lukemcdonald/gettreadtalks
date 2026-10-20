'use client';

import type { UpdateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker } from '@/features/speakers/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { FormSheet } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateSpeakerAction } from '@/features/speakers/actions/update-speaker';
import { updateSpeakerSchema } from '@/features/speakers/schemas/speaker-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

import { SpeakerFormFields } from './speaker-form-fields';

interface EditSpeakerSheetProps {
  closeHref?: string;
  speaker: Speaker | null;
}

export function EditSpeakerSheet({
  closeHref,
  speaker,
}: EditSpeakerSheetProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateSpeakerFormData>({
    mode: 'onBlur',
    resolver: zodResolver(updateSpeakerSchema),
    values: {
      description: speaker?.description ?? '',
      featured: speaker?.featured ?? false,
      firstName: speaker?.firstName ?? '',
      imageUrl: speaker?.imageUrl ?? '',
      lastName: speaker?.lastName ?? '',
      ministry: speaker?.ministry ?? '',
      role: speaker?.role ?? '',
      slug: speaker?.slug ?? '',
      websiteUrl: speaker?.websiteUrl ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!speaker) {
      return;
    }

    startTransition(async () => {
      const result = await updateSpeakerAction(data, speaker._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      toastManager.add({ title: 'Speaker updated', type: 'success' });
      handleSuccess();
      handleOpenChange(false);
    });
  });

  if (!speaker) {
    return null;
  }

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      open
      submitLabel="Save Changes"
      title="Edit Speaker"
    >
      <SpeakerFormFields control={form.control} mode="edit" />
    </FormSheet>
  );
}
