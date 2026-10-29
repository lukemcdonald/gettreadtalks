'use client';

import type { TalkStudyFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkId } from '@/features/talks/types';
import type { UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { SelectField, TextareaField } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { updateTalkStudyAction } from '@/features/talks/actions/update-talk-study';
import { TalkSummaryGenerate } from '@/features/talks/components/talk-summary-generate';
import { talkStudyFormSchema } from '@/features/talks/schemas/talk-study-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const STUDY_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

// fallow-ignore-next-line complexity
export function useTalkSummaryForm(talkId: TalkId) {
  const study = useQuery(api.talks.getTalkStudy, { talkId });
  const transcript = useQuery(api.talks.getTalkTranscript, { talkId });
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

  async function save() {
    if (!form.formState.isDirty) {
      return { success: true as const };
    }

    const result = await updateTalkStudyAction(form.getValues(), talkId);

    if (!result.success) {
      setServerErrors(form.setError, result.errors);
    }

    return result;
  }

  return {
    form,
    handleFlagsChange: setSummaryFlags,
    hasTranscript: Boolean(transcript),
    save,
    summaryFlags,
  };
}

export function TalkSummaryFields({
  form,
  hasTranscript,
  onFlagsChange,
  summaryFlags,
  talkId,
}: {
  form: UseFormReturn<TalkStudyFormData>;
  hasTranscript: boolean;
  onFlagsChange: (flags: string[]) => void;
  summaryFlags: string[];
  talkId: TalkId;
}) {
  return (
    <div className="space-y-4">
      <TextareaField
        control={form.control}
        label="Summary"
        name="summary"
        rows={4}
      />
      <div className="flex flex-wrap items-end gap-4">
        <TalkSummaryGenerate
          hasTranscript={hasTranscript}
          onFlagsChange={onFlagsChange}
          talkId={talkId}
        />
        <SelectField
          control={form.control}
          label="Status"
          name="studyStatus"
          options={STUDY_STATUS_OPTIONS}
        />
      </div>
      {summaryFlags.length > 0 ? (
        <p
          className="text-muted-foreground text-sm"
          data-testid="summary-flags"
        >
          Review: {summaryFlags.join(' · ')}
        </p>
      ) : null}
    </div>
  );
}
