'use client';

import type { TalkStudyFormData } from '@/features/talks/schemas/talk-study-form';
import type {
  TalkId,
  TalkStudy,
  TalkTranscriptMeta,
} from '@/features/talks/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { FormSheet, SelectField, TextareaField } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { updateTalkStudyAction } from '@/features/talks/actions/update-talk-study';
import { TalkSummaryGenerate } from '@/features/talks/components/talk-summary-generate';
import { TalkTranscriptDialog } from '@/features/talks/components/talk-transcript-dialog';
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
  study: initialStudy,
  talkId,
  transcript: initialTranscript,
}: {
  closeHref?: string;
  study: TalkStudy | null;
  talkId: TalkId;
  transcript: TalkTranscriptMeta | null;
}) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);
  const liveStudy = useQuery(api.talks.getTalkStudy, { talkId });
  const liveTranscript = useQuery(api.talks.getTalkTranscript, { talkId });
  const study = liveStudy === undefined ? initialStudy : liveStudy;
  const transcript =
    liveTranscript === undefined ? initialTranscript : liveTranscript;
  const [isPending, startTransition] = useTransition();
  const [summaryFlags, setSummaryFlags] = useState<string[]>([]);
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
            {summaryFlags.length > 0 ? (
              <p
                className="text-muted-foreground text-sm"
                data-testid="summary-flags"
              >
                Review: {summaryFlags.join(' · ')}
              </p>
            ) : null}
          </>
        ) : (
          <span className="text-sm">None</span>
        )}
        <TalkSummaryGenerate
          hasTranscript={Boolean(transcript)}
          onFlagsChange={setSummaryFlags}
          talkId={talkId}
        />
        <TalkTranscriptFetch
          hasTranscript={Boolean(transcript)}
          talkId={talkId}
        >
          {transcript ? <TalkTranscriptDialog talkId={talkId} /> : null}
        </TalkTranscriptFetch>
      </div>
    </FormSheet>
  );
}
