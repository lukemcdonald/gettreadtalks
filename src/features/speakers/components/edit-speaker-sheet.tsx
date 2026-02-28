'use client';

import type { UpdateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FeaturedField, FormSheet } from '@/components/ui';
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
    resolver: zodResolver(updateSpeakerSchema),
    mode: 'onBlur',
    values: {
      description: speaker?.description ?? '',
      featured: speaker?.featured ?? false,
      firstName: speaker?.firstName ?? '',
      imageUrl: speaker?.imageUrl ?? '',
      lastName: speaker?.lastName ?? '',
      ministry: speaker?.ministry ?? '',
      role: speaker?.role ?? '',
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
      <SpeakerFormFields control={form.control} />
      <FeaturedField control={form.control} name="featured" />
    </FormSheet>
  );
}
