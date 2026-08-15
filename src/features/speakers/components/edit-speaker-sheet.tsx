'use client';

import type { UpdateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateSpeakerAction } from '@/features/speakers/actions/update-speaker';
import { updateSpeakerSchema } from '@/features/speakers/schemas/speaker-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

import { SpeakerFormFields } from './speaker-form-fields';

interface EditSpeakerSheetProps {
  onOpenChange: (open: boolean) => void;
  onSpeakerUpdated: (speakerId: SpeakerId) => void;
  open: boolean;
  speaker: Speaker | null;
}

export function EditSpeakerSheet({
  onOpenChange,
  onSpeakerUpdated,
  open,
  speaker,
}: EditSpeakerSheetProps) {
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
      onSpeakerUpdated(speaker._id);
      onOpenChange(false);
    });
  });

  if (!speaker) {
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
      title="Edit Speaker"
    >
      <SpeakerFormFields control={form.control} mode="edit" />
    </FormSheet>
  );
}
