'use client';

import type { CreateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useEffect, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { createSpeakerAction } from '@/features/speakers/actions/create-speaker';
import { createSpeakerSchema } from '@/features/speakers/schemas/speaker-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';
import { SpeakerFormFields } from './speaker-form-fields';

type NewSpeaker = Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'imageUrl' | 'role'>;

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
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateSpeakerFormData>({
    defaultValues: {
      description: '',
      firstName: '',
      imageUrl: '',
      lastName: '',
      ministry: '',
      role: '',
      websiteUrl: '',
    },
    resolver: zodResolver(createSpeakerSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await createSpeakerAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      const newSpeaker: NewSpeaker = {
        _id: result.data.speakerId,
        firstName: data.firstName,
        imageUrl: data.imageUrl || undefined,
        lastName: data.lastName,
        role: data.role || undefined,
      };

      onSpeakerCreated(result.data.speakerId, newSpeaker);
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
      submitLabel="Create Speaker"
      title="Add New Speaker"
    >
      <SpeakerFormFields control={form.control} />
    </FormSheet>
  );
}
