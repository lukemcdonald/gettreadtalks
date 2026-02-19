'use client';

import type { CreateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useEffect, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  FormError,
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from '@/components/ui';
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
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Add New Speaker</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            <FormError error={form.formState.errors.root} />

            <SpeakerFormFields control={form.control} />
          </SheetPanel>

          <SheetFooter>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Creating...' : 'Create Speaker'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
