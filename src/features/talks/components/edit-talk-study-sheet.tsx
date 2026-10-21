'use client';

import type { TalkStudyFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkId, TalkStudy, TalkTranscript } from '@/features/talks/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { FormSheet, SelectField, TextareaField } from '@/components/ui';
import { updateTalkStudyAction } from '@/features/talks/actions/update-talk-study';
import { TalkTranscriptFetch } from '@/features/talks/components/talk-transcript-fetch';
import { talkStudyFormSchema } from '@/features/talks/schemas/talk-study-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const STUDY_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

// fallow-ignore-next-line complexity
export function EditTalkStudySheet({
  closeHref,
  study,
  talkId,
  transcript,
}: {
  closeHref?: string;
  study: TalkStudy | null;
  talkId: TalkId;
  transcript: TalkTranscript | null;
}) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TalkStudyFormData>({
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkStudyFormSchema as any),
    values: {
      studyStatus: study?.studyStatus ?? 'draft',
      summary: study?.summary ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!study) {
      handleOpenChange(false);
      return;
    }

    startTransition(async () => {
      const result = await updateTalkStudyAction(data, talkId);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      handleSuccess();
      handleOpenChange(false);
    });
  });

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      open
      submitLabel="Save Changes"
      title="Edit Study"
    >
      <div className="space-y-4">
        {study ? (
          <>
            <SelectField
              control={form.control}
              label="Status"
              name="studyStatus"
              options={STUDY_STATUS_OPTIONS}
            />
            <TextareaField
              control={form.control}
              label="Summary"
              name="summary"
              rows={4}
            />
          </>
        ) : (
          <span className="text-sm">None</span>
        )}
        <TalkTranscriptFetch
          hasTranscript={Boolean(transcript?.text)}
          talkId={talkId}
        />
      </div>
    </FormSheet>
  );
}
