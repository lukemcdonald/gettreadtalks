'use client';

import type { UpdateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  FeaturedField,
  FormError,
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from '@/components/ui';
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
    values: {
      description: speaker?.description ?? '',
      featured: speaker?.featured ?? false,
      firstName: speaker?.firstName ?? '',
      imageUrl: speaker?.imageUrl ?? '',
      lastName: speaker?.lastName ?? '',
      ministry: speaker?.ministry ?? '',
      role: speaker?.role ?? undefined,
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
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Edit Speaker</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            <FormError error={form.formState.errors.root} />

            <SpeakerFormFields control={form.control} />
            <FeaturedField control={form.control} name="featured" />
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
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
