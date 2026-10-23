'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { Talk, TalkStudy, TalkWithTopicIds } from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { ManageStatusBadge } from '@/components/manage-table';
import { FormSheet } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { slugify } from '@/convex/lib/utils';
import { updateTalkAction } from '@/features/talks/actions/update-talk';
import { TalkFormFields } from '@/features/talks/components/talk-form-fields';
import { UrlChangeDialog } from '@/features/talks/components/url-change-dialog';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { buildTalkPath, buildTalkStudyPath } from '@/features/talks/utils';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface EditTalkSheetProps {
  closeHref?: string;
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
  statusPrefill?: StatusPrefill;
  studyStatus?: TalkStudy['studyStatus'] | null;
  talk: TalkWithTopicIds;
  topics: TopicListItem[];
}

type UrlChange = { newUrl: string; oldUrl: string } | null;

function getTalkFormValues(
  talk: TalkWithTopicIds,
  statusPrefill?: StatusPrefill
): TalkFormData {
  return {
    collectionId: talk.collectionId,
    collectionOrder: talk.collectionId ? talk.collectionOrder : undefined,
    featured: talk.featured ?? false,
    mediaUrl: talk.mediaUrl ?? '',
    scripture: talk.scripture ?? '',
    slug: talk.slug ?? '',
    speakerId: talk.speakerId,
    status: statusPrefill ?? talk.status ?? 'backlog',
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
    newUrl: buildTalkPath({
      speaker: { slug: speakerSegment },
      slug: newTalkSlug,
    }),
    oldUrl: buildTalkPath({
      speaker: { slug: '<speaker>' },
      slug: oldTalkSlug,
    }),
  };
}

export function EditTalkSheet({
  closeHref,
  collections,
  speakers,
  statusPrefill,
  studyStatus,
  talk,
  topics,
}: EditTalkSheetProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);
  const [isPending, startTransition] = useTransition();
  const [pendingData, setPendingData] = useState<TalkFormData | null>(null);
  const [urlChange, setUrlChange] = useState<UrlChange>(null);
  const [urlChangeOpen, setUrlChangeOpen] = useState(false);

  const form = useForm<TalkFormData>({
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
    values: getTalkFormValues(talk, statusPrefill),
  });

  function submitData(data: TalkFormData) {
    startTransition(async () => {
      const result = await updateTalkAction(data, talk._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      handleSuccess();
      handleOpenChange(false);
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
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        open
        submitLabel="Save Changes"
        title="Edit Talk"
      >
        <div className="space-y-4">
          <TalkFormFields
            collections={collections}
            control={form.control}
            mode="edit"
            setValue={form.setValue}
            speakers={speakers}
            topics={topics}
          />
          <Link
            className="flex items-center justify-between gap-3 text-sm"
            href={buildTalkStudyPath(talk._id)}
          >
            <span className="font-medium">Study</span>
            {studyStatus ? <ManageStatusBadge status={studyStatus} /> : 'None'}
          </Link>
        </div>
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
