'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { Talk, TalkId } from '@/features/talks/types';

import { useRef, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
  talk: Talk;
}

type UrlChange = { newUrl: string; oldUrl: string } | null;

export function EditTalkSheet({
  collections,
  onOpenChange,
  onTalkUpdated,
  open,
  speakers,
  talk,
}: EditTalkSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [urlChange, setUrlChange] = useState<UrlChange>(null);
  const [urlChangeOpen, setUrlChangeOpen] = useState(false);
  const pendingData = useRef<TalkFormData | null>(null);

  const form = useForm<TalkFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4
    resolver: zodResolver(talkFormSchema as any),
    mode: 'onBlur',
    values: {
      collectionId: talk?.collectionId,
      collectionOrder: talk?.collectionOrder,
      description: talk?.description ?? '',
      featured: talk?.featured ?? false,
      mediaUrl: talk?.mediaUrl ?? '',
      scripture: talk?.scripture ?? '',
      slug: talk?.slug ?? '',
      speakerId: talk?.speakerId ?? '',
      status: talk?.status ?? 'backlog',
      title: talk?.title ?? '',
    },
  });

  function getUrlChangeForTalk(data: TalkFormData) {
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
    if (!talk) {
      return;
    }

    const change = getUrlChangeForTalk(data);

    if (change) {
      pendingData.current = data;
      setUrlChange(change);
      setUrlChangeOpen(true);
      return;
    }

    submitData(data);
  });

  function confirmUrlChange() {
    const data = pendingData.current;

    if (!data) {
      return;
    }

    pendingData.current = null;
    setUrlChangeOpen(false);
    setUrlChange(null);
    submitData(data);
  }

  if (!talk) {
    return null;
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
