'use client';

import type { TalkStudyFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkId, TalkStudy, TalkTranscript } from '@/features/talks/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { setTalkStudyStatusAction } from '@/features/talks/actions/set-talk-study-status';
import { updateTalkStudyAction } from '@/features/talks/actions/update-talk-study';
import { TalkStudyFields } from '@/features/talks/components/talk-study-fields';
import { talkStudyFormSchema } from '@/features/talks/schemas/talk-study-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface EditTalkStudySheetProps {
  onOpenChange: (open: boolean) => void;
  onStudyUpdated: (talkId: TalkId) => void;
  open: boolean;
  study: TalkStudy | null;
  talkId: TalkId;
  transcript: TalkTranscript | null;
}

function getStudyFormValues(study: TalkStudy | null): TalkStudyFormData {
  if (!study) {
    return {
      outline: [],
      scriptureRefs: [],
      studyGuide: [],
      suggestedTopics: '',
      summary: '',
    };
  }

  return {
    outline: study.outline,
    scriptureRefs: study.scriptureRefs,
    studyGuide: study.studyGuide,
    suggestedTopics: study.suggestedTopics.join(', '),
    summary: study.summary,
  };
}

export function EditTalkStudySheet({
  onOpenChange,
  onStudyUpdated,
  open,
  study,
  talkId,
  transcript,
}: EditTalkStudySheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TalkStudyFormData>({
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkStudyFormSchema as any),
    values: getStudyFormValues(study),
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!study) {
      onOpenChange(false);
      return;
    }

    startTransition(async () => {
      const result = await updateTalkStudyAction(data, talkId);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onStudyUpdated(talkId);
      onOpenChange(false);
    });
  });

  function handleStudyStatus(studyStatus: TalkStudy['studyStatus']) {
    startTransition(async () => {
      const result = await setTalkStudyStatusAction(talkId, studyStatus);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onStudyUpdated(talkId);
    });
  }

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Save Changes"
      title="Edit Study"
    >
      <TalkStudyFields
        control={form.control}
        isPending={isPending}
        onSetStatus={handleStudyStatus}
        study={study}
        transcript={transcript}
      />
    </FormSheet>
  );
}
