'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { Talk, TalkId, TalkWithTopicIds } from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { slugify } from '@/convex/lib/utils';
import { updateTalkAction } from '@/features/talks/actions/update-talk';
import { TalkFormFields } from '@/features/talks/components/talk-form-fields';
import { UrlChangeDialog } from '@/features/talks/components/url-change-dialog';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { getTalkUrl } from '@/features/talks/utils';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface EditTalkSheetProps {
  collections: CollectionListItem[];
  onOpenChange: (open: boolean) => void;
  onTalkUpdated: (talkId: TalkId) => void;
  open: boolean;
  speakers: SpeakerListItem[];
  talk: TalkWithTopicIds;
  topics: TopicListItem[];
}

type UrlChange = { newUrl: string; oldUrl: string } | null;

function getTalkFormValues(talk: TalkWithTopicIds): TalkFormData {
  return {
    collectionId: talk.collectionId,
    collectionOrder: talk.collectionOrder,
    description: talk.description ?? '',
    featured: talk.featured ?? false,
    mediaUrl: talk.mediaUrl ?? '',
    scripture: talk.scripture ?? '',
    slug: talk.slug ?? '',
    speakerId: talk.speakerId ?? '',
    status: talk.status ?? 'backlog',
    title: talk.title ?? '',
    topicIds: talk.topicIds,
  };
}

function getUrlChangeForTalk(talk: Talk, data: TalkFormData): UrlChange {
  if (talk.status !== 'published') {
    return null;
  }

  const oldTalkSlug = talk.slug;
  const newTalkSlug = data.slug ? slugify(data.slug) : oldTalkSlug;

  const slugChanged = newTalkSlug !== oldTalkSlug;
  const speakerChanged = data.speakerId !== talk.speakerId;

  if (!(slugChanged || speakerChanged)) {
    return null;
  }

  const speakerSegment = speakerChanged ? '<new-speaker>' : '<speaker>';

  return {
    newUrl: getTalkUrl(speakerSegment, newTalkSlug),
    oldUrl: getTalkUrl('<speaker>', oldTalkSlug),
  };
}

export function EditTalkSheet({
  collections,
  onOpenChange,
  onTalkUpdated,
  open,
  speakers,
  talk,
  topics,
}: EditTalkSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingData, setPendingData] = useState<TalkFormData | null>(null);
  const [urlChange, setUrlChange] = useState<UrlChange>(null);
  const [urlChangeOpen, setUrlChangeOpen] = useState(false);

  const form = useForm<TalkFormData>({
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
    values: getTalkFormValues(talk),
  });

  function submitData(data: TalkFormData) {
    startTransition(async () => {
      const result = await updateTalkAction(data, talk._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onTalkUpdated(talk._id);
      onOpenChange(false);
    });
  }

  const handleSubmit = form.handleSubmit((data) => {
    const change = getUrlChangeForTalk(talk, data);

    if (change) {
      setPendingData(data);
      setUrlChange(change);
      setUrlChangeOpen(true);
      return;
    }

    submitData(data);
  });

  function confirmUrlChange() {
    if (!pendingData) {
      return;
    }

    const data = pendingData;
    setPendingData(null);
    setUrlChange(null);
    setUrlChangeOpen(false);
    submitData(data);
  }

  return (
    <>
      <FormSheet
        error={form.formState.errors.root}
        isPending={isPending}
        onOpenChange={onOpenChange}
        onSubmit={handleSubmit}
        open={open}
        submitLabel="Save Changes"
        title="Edit Talk"
      >
        <TalkFormFields
          collections={collections}
          control={form.control}
          mode="edit"
          speakers={speakers}
          topics={topics}
        />
      </FormSheet>

      {urlChange && (
        <UrlChangeDialog
          newUrl={urlChange.newUrl}
          oldUrl={urlChange.oldUrl}
          onConfirm={confirmUrlChange}
          onOpenChange={setUrlChangeOpen}
          open={urlChangeOpen}
        />
      )}
    </>
  );
}
