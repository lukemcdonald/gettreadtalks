'use client';

import type { ClipId } from '@/features/clips/types';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { TalkId, TalkListItem } from '@/features/talks/types';
import type { StatusType } from '@/lib/entities/types';
import type { ClipFormData } from '../schemas/clip-form';

import { useTransition } from 'react';
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
import { updateClipAction } from '@/features/clips/actions/update-clip';
import { setServerErrors } from '@/lib/forms/react-hook-form';
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
  talks: TalkListItem[];
}

export function EditClipSheet({
  clip,
  onClipUpdated,
  onOpenChange,
  open,
  speakers,
  talks,
}: EditClipSheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ClipFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod 4 compatibility with zodResolver
    resolver: zodResolver(clipFormSchema as any),
    mode: 'onBlur',
    values: {
      description: clip?.description ?? '',
      mediaUrl: clip?.mediaUrl ?? '',
      speakerId: clip?.speakerId,
      status: clip?.status ?? 'backlog',
      talkId: clip?.talkId,
      title: clip?.title ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!clip) {
      return;
    }

    startTransition(async () => {
      const result = await updateClipAction(data, clip._id);

      if (!result.success) {
        form.setError('root', {
          type: 'server',
          message: 'Failed to update clip. Please check the errors below.',
        });
        setServerErrors(form.setError, result.errors);
        return;
      }

      onClipUpdated(clip._id);
      onOpenChange(false);
    });
  });

  if (!clip) {
    return null;
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Edit Clip</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
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
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
