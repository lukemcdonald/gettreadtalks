'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { EditTalkFormData } from '@/features/talks/schemas/talk-study-form';
import type {
  Talk,
  TalkId,
  TalkStudy,
  TalkTranscript,
  TalkWithTopicIds,
} from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { slugify } from '@/convex/lib/utils';
import { setTalkStudyStatusAction } from '@/features/talks/actions/set-talk-study-status';
import { updateTalkAction } from '@/features/talks/actions/update-talk';
import { updateTalkStudyAction } from '@/features/talks/actions/update-talk-study';
import { TalkFormFields } from '@/features/talks/components/talk-form-fields';
import { TalkStudyFields } from '@/features/talks/components/talk-study-fields';
import { TalkTranscriptStatus } from '@/features/talks/components/talk-transcript-status';
import { UrlChangeDialog } from '@/features/talks/components/url-change-dialog';
import {
  editTalkFormSchema,
  formatSuggestedTopics,
} from '@/features/talks/schemas/talk-study-form';
import { buildTalkPath } from '@/features/talks/utils';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface EditTalkSheetProps {
  collections: CollectionListItem[];
  onOpenChange: (open: boolean) => void;
  onTalkUpdated: (talkId: TalkId) => void;
  open: boolean;
  speakers: SpeakerListItem[];
  statusPrefill?: StatusPrefill;
  study: TalkStudy | null;
  talk: TalkWithTopicIds;
  topics: TopicListItem[];
  transcript: TalkTranscript | null;
}

type UrlChange = { newUrl: string; oldUrl: string } | null;

function getStudyFormValues(study: TalkStudy | null) {
  if (!study) {
    return;
  }

  return {
    outline: study.outline,
    scriptureRefs: study.scriptureRefs,
    studyGuide: study.studyGuide,
    suggestedTopics: formatSuggestedTopics(study.suggestedTopics),
    summary: study.summary,
  };
}

function getTalkFormValues(
  study: TalkStudy | null,
  talk: TalkWithTopicIds,
  statusPrefill?: StatusPrefill
): EditTalkFormData {
  return {
    collectionId: talk.collectionId,
    collectionOrder: talk.collectionId ? talk.collectionOrder : undefined,
    description: talk.description ?? '',
    featured: talk.featured ?? false,
    mediaUrl: talk.mediaUrl ?? '',
    scripture: talk.scripture ?? '',
    slug: talk.slug ?? '',
    speakerId: talk.speakerId,
    status: statusPrefill ?? talk.status ?? 'backlog',
    study: getStudyFormValues(study),
    title: talk.title ?? '',
    topicIds: talk.topicIds,
  };
}

function getUrlChangeForTalk(talk: Talk, data: EditTalkFormData): UrlChange {
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
  collections,
  onOpenChange,
  onTalkUpdated,
  open,
  speakers,
  statusPrefill,
  study,
  talk,
  topics,
  transcript,
}: EditTalkSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingData, setPendingData] = useState<EditTalkFormData | null>(null);
  const [urlChange, setUrlChange] = useState<UrlChange>(null);
  const [urlChangeOpen, setUrlChangeOpen] = useState(false);

  const form = useForm<EditTalkFormData>({
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(editTalkFormSchema as any),
    values: getTalkFormValues(study, talk, statusPrefill),
  });

  function submitData(data: EditTalkFormData) {
    startTransition(async () => {
      const { study: studyData, ...talkData } = data;
      const talkResult = await updateTalkAction(talkData, talk._id);

      if (!talkResult.success) {
        setServerErrors(form.setError, talkResult.errors);
        return;
      }

      if (studyData) {
        const studyResult = await updateTalkStudyAction(studyData, talk._id);

        if (!studyResult.success) {
          setServerErrors(form.setError, studyResult.errors);
          return;
        }
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

  function handleStudyStatus(studyStatus: TalkStudy['studyStatus']) {
    startTransition(async () => {
      const result = await setTalkStudyStatusAction(talk._id, studyStatus);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onTalkUpdated(talk._id);
    });
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
          control={form.control as Control<TalkFormData>}
          mode="edit"
          setValue={form.setValue as UseFormSetValue<TalkFormData>}
          speakers={speakers}
          topics={topics}
        />
        {study ? (
          <TalkStudyFields
            control={form.control}
            isPending={isPending}
            onPublish={() => {
              handleStudyStatus('published');
            }}
            onUnpublish={() => {
              handleStudyStatus('draft');
            }}
            studyStatus={study.studyStatus}
          />
        ) : null}
        <TalkTranscriptStatus transcript={transcript} />
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
