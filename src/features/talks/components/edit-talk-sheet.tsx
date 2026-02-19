'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { Talk, TalkId } from '@/features/talks/types';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
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

  const form = useForm<TalkFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
    mode: 'onBlur',
    values: {
      collectionId: talk?.collectionId,
      collectionOrder: talk?.collectionOrder,
      description: talk?.description ?? '',
      featured: talk?.featured ?? false,
      mediaUrl: talk?.mediaUrl ?? '',
      scripture: talk?.scripture ?? '',
      speakerId: talk?.speakerId ?? '',
      status: talk?.status ?? 'backlog',
      title: talk?.title ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!talk) {
      return;
    }

    startTransition(async () => {
      const result = await updateTalkAction(data, talk._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
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
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Save Changes"
      title="Edit Talk"
    >
      <TalkFormFields collections={collections} control={form.control} speakers={speakers} />
    </FormSheet>
  );
}
