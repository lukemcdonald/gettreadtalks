'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { Talk, TalkId, TalkStatus } from '@/features/talks/types';

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
import { updateTalkAction } from '@/features/talks/actions/update-talk';
import { TalkFormFields } from '@/features/talks/components/talk-form-fields';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface EditTalkSheetProps {
  collections: CollectionListItem[];
  onOpenChange: (open: boolean) => void;
  onTalkUpdated: (talkId: TalkId) => void;
  open: boolean;
  speakers: SpeakerListItem[];
  talk: Talk;
}

export function EditTalkSheet({
  collections,
  onOpenChange,
  onTalkUpdated,
  open,
  speakers,
  talk,
}: EditTalkSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TalkFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
    mode: 'onBlur',
    defaultValues: {
      collectionId: talk?.collectionId,
      collectionOrder: talk?.collectionOrder,
      description: talk?.description ?? '',
      featured: talk?.featured ?? false,
      mediaUrl: talk?.mediaUrl ?? '',
      scripture: talk?.scripture ?? '',
      speakerId: talk?.speakerId ?? ('' as SpeakerId),
      status: talk?.status ?? 'backlog',
      title: talk?.title ?? '',
    },
  });

  useEffect(() => {
    if (open && talk) {
      form.reset({
        collectionId: talk.collectionId,
        collectionOrder: talk.collectionOrder,
        description: talk.description ?? '',
        featured: talk.featured ?? false,
        mediaUrl: talk.mediaUrl,
        scripture: talk.scripture ?? '',
        speakerId: talk.speakerId,
        status: talk.status ?? 'backlog',
        title: talk.title,
      });
      setError(null);
    }
  }, [form, open, talk]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!talk) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await updateTalkAction(data, talk._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to update talk. Please check the errors below.');
        return;
      }

      onTalkUpdated(talk._id);
      onOpenChange(false);
    });
  });

  if (!talk) {
    return null;
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Edit Talk</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            {!!error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <FormError error={form.formState.errors.root} />

            <TalkFormFields collections={collections} control={form.control} speakers={speakers} />
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
