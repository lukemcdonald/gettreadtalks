'use client';

import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { TalkId } from '@/features/talks/types';

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
import { createTalkAction } from '@/features/talks/actions';
import { TalkFormFields } from '@/features/talks/components/talk-form-fields';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

type SpeakerListItem = Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'imageUrl' | 'role'>;
type CollectionListItem = Pick<Collection, '_id' | 'slug' | 'title'>;

interface CreateTalkSheetProps {
  collections: CollectionListItem[];
  onOpenChange: (open: boolean) => void;
  onTalkCreated: (talkId: TalkId) => void;
  open: boolean;
  speakers: SpeakerListItem[];
  /** For nested sheets, use 'nested' to stack above other sheets */
  zIndex?: 'default' | 'nested';
}

export function CreateTalkSheet({
  collections,
  onOpenChange,
  onTalkCreated,
  open,
  speakers,
  zIndex = 'default',
}: CreateTalkSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TalkFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
    mode: 'onBlur',
    defaultValues: {
      collectionId: undefined,
      collectionOrder: undefined,
      description: '',
      featured: false,
      mediaUrl: '',
      scripture: '',
      speakerId: '' as SpeakerId,
      status: 'backlog',
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
      const result = await createTalkAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to create talk. Please check the errors below.');
        return;
      }

      onTalkCreated(result.data.talkId as TalkId);
      onOpenChange(false);
    });
  });

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right" size="lg" zIndex={zIndex}>
        <SheetHeader>
          <SheetTitle>Add New Talk</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit}>
          <SheetPanel>
            {!!error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <FormError error={form.formState.errors.root} />

            <TalkFormFields
              collections={collections}
              control={form.control}
              inSheet
              speakers={speakers}
            />
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
              {isPending ? 'Creating...' : 'Create Talk'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
