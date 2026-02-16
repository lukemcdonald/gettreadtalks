'use client';

import type { ClipId } from '@/features/clips/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkListItem } from '@/features/talks/types';
import type { ClipFormData } from '../schemas/clip-form';

import { useEffect, useState, useTransition } from 'react';
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
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!open) {
      form.reset();
      form.clearErrors();
      setError(null);
    }
  }, [form, open]);

  const handleSubmit = form.handleSubmit((data) => {
    setError(null);
    startTransition(async () => {
      const result = await createClipAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to create clip. Please check the errors below.');
        return;
      }

      onClipCreated(result.data.clipId);
      onOpenChange(false);
    });
  });

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Add New Clip</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            {error ? (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            ) : null}

            <FormError error={form.formState.errors.root} />
            <ClipFormFields control={form.control} speakers={speakers} talks={talks} />
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
              {isPending ? 'Creating...' : 'Create Clip'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
