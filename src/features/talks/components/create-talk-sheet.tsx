'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { TalkId } from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { createTalkAction } from '@/features/talks/actions/create-talk';
import { TalkFormFields } from '@/features/talks/components/talk-form-fields';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface CreateTalkSheetProps {
  collections: CollectionListItem[];
  onOpenChange: (open: boolean) => void;
  onTalkCreated: (talkId: TalkId) => void;
  open: boolean;
  speakers: SpeakerListItem[];
  topics: TopicListItem[];
}

export function CreateTalkSheet({
  collections,
  onOpenChange,
  onTalkCreated,
  open,
  speakers,
  topics,
}: CreateTalkSheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TalkFormData>({
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
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
      topicIds: [],
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await createTalkAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onTalkCreated(result.data.talkId as TalkId);
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
      submitLabel="Create Talk"
      title="Add New Talk"
    >
      <TalkFormFields
        collections={collections}
        control={form.control}
        speakers={speakers}
        topics={topics}
      />
    </FormSheet>
  );
}
