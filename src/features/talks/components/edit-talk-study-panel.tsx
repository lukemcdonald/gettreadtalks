'use client';

import type { TalkStudyFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkId, TalkStudy } from '@/features/talks/types';
import type { UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import {
  Button,
  FormError,
  FormSheetBody,
  SelectField,
  TextareaField,
} from '@/components/ui';
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

function EditTalkStudyFields({
  form,
  study,
  summaryFlags,
}: {
  form: UseFormReturn<TalkStudyFormData>;
  study: TalkStudy | null | undefined;
  summaryFlags: string[];
}) {
  if (study === undefined) {
    return null;
  }

  if (!study) {
    return <span className="text-sm">None</span>;
  }

  return (
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
  );
}

// fallow-ignore-next-line complexity
function useEditTalkStudyPanel({
  onClose,
  onSaved,
  talkId,
}: {
  onClose: () => void;
  onSaved: () => void;
  talkId: TalkId;
}) {
  const study = useQuery(api.talks.getTalkStudy, { talkId });
  const transcript = useQuery(api.talks.getTalkTranscript, { talkId });
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
      onClose();
      return;
    }

    startTransition(async () => {
      const result = await updateTalkStudyAction(data, talkId);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onSaved();
    });
  });

  return {
    form,
    handleSubmit,
    isPending,
    setSummaryFlags,
    study,
    summaryFlags,
    transcript,
  };
}

export function EditTalkStudyPanel({
  onClose,
  onSaved,
  talkId,
}: {
  onClose: () => void;
  onSaved: () => void;
  talkId: TalkId;
}) {
  const {
    form,
    handleSubmit,
    isPending,
    setSummaryFlags,
    study,
    summaryFlags,
    transcript,
  } = useEditTalkStudyPanel({ onClose, onSaved, talkId });

  return (
    <form className="contents" onSubmit={handleSubmit}>
      <FormSheetBody
        footer={
          <>
            <Button
              disabled={isPending}
              onClick={onClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            {study ? (
              <Button loading={isPending} type="submit">
                Save Changes
              </Button>
            ) : null}
          </>
        }
      >
        <div className="space-y-4" data-testid="edit-talk-study-panel">
          <FormError error={form.formState.errors.root} />
          <EditTalkStudyFields
            form={form}
            study={study}
            summaryFlags={summaryFlags}
          />
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
      </FormSheetBody>
    </form>
  );
}
