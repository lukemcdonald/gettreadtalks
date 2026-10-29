'use client';

import type { CreateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { createSpeakerAction } from '@/features/speakers/actions/create-speaker';
import { createSpeakerSchema } from '@/features/speakers/schemas/speaker-form';
import { stripEmptyStrings } from '@/lib/forms/schemas';
import { useCreateFormSheet } from '@/lib/forms/use-create-form-sheet';

import { SpeakerFormFields } from './speaker-form-fields';

type NewSpeaker = Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'role'>;

interface CreateSpeakerSheetProps {
  onOpenChange: (open: boolean) => void;
  onSpeakerCreated: (speakerId: SpeakerId, speaker: NewSpeaker) => void;
  open: boolean;
}

export function CreateSpeakerSheet({
  onOpenChange,
  onSpeakerCreated,
  open,
}: CreateSpeakerSheetProps) {
  const form = useForm<CreateSpeakerFormData>({
    defaultValues: {
      description: '',
      firstName: '',
      lastName: '',
      ministry: '',
      role: '',
      websiteUrl: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(createSpeakerSchema),
  });

  const { handleSubmit, isPending } = useCreateFormSheet({
    form,
    onOpenChange,
    onSuccess: (data, values) => {
      const cleaned = stripEmptyStrings(values);
      const newSpeaker: NewSpeaker = {
        _id: data.speakerId,
        firstName: cleaned.firstName,
        lastName: cleaned.lastName,
        role: cleaned.role,
      };

      toastManager.add({ title: 'Speaker created', type: 'success' });
      onSpeakerCreated(data.speakerId, newSpeaker);
    },
    open,
    submit: createSpeakerAction,
  });

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Create Speaker"
      title="Add New Speaker"
    >
      <SpeakerFormFields control={form.control} />
    </FormSheet>
  );
}
