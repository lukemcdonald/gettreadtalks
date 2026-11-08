'use client';

import type { TalkSummaryFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkId } from '@/features/talks/types';
import type { UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Field, FieldError, FieldLabel, Textarea } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { getTalkSummaryEditorValue } from '@/features/talks/components/talk-generate-status';
import { TalkSummaryGenerate } from '@/features/talks/components/talk-summary-generate';
import { talkSummaryFormSchema } from '@/features/talks/schemas/talk-study-form';

// fallow-ignore-next-line complexity
export function useTalkSummaryForm(
  talkId: TalkId,
  hasTranscriptPrefill = false
) {
  const talkDoc = useQuery(api.talks.getTalk, { id: talkId });
  const transcript = useQuery(api.talks.getTalkTranscript, { talkId });
  const [summaryFlags, setSummaryFlags] = useState<string[]>([]);
  const form = useForm<TalkSummaryFormData>({
    mode: 'onBlur',
    resetOptions: { keepDirtyValues: true },
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkSummaryFormSchema as any),
    values: {
      summary: getTalkSummaryEditorValue(talkDoc ?? null),
    },
  });

  function getDirtySummary() {
    if (!form.formState.isDirty) {
      return;
    }

    return form.getValues().summary;
  }

  return {
    form,
    getDirtySummary,
    handleFlagsChange: setSummaryFlags,
    hasTranscript:
      transcript === undefined ? hasTranscriptPrefill : Boolean(transcript),
    summaryFlags,
  };
}

export function TalkSummaryFields({
  canGenerate,
  form,
  hasTranscript,
  onFlagsChange,
  summaryFlags,
  talkId,
}: {
  canGenerate: boolean;
  form: UseFormReturn<TalkSummaryFormData>;
  hasTranscript: boolean;
  onFlagsChange: (flags: string[]) => void;
  summaryFlags: string[];
  talkId: TalkId;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Field className="contents">
        <FieldLabel htmlFor="summary">Summary</FieldLabel>
      </Field>
      <Controller
        control={form.control}
        name="summary"
        render={({ field, fieldState }) => (
          <Field
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <Textarea
              className="[&_[data-slot=textarea]]:field-sizing-fixed [&_[data-slot=textarea]]:min-h-40"
              rows={8}
              size="lg"
              {...field}
              aria-invalid={fieldState.invalid}
              id={field.name}
            />
            {fieldState.error ? (
              <FieldError match>{fieldState.error.message}</FieldError>
            ) : null}
            <TalkSummaryGenerate
              canGenerate={canGenerate}
              hasTranscript={hasTranscript}
              onFlagsChange={onFlagsChange}
              talkId={talkId}
            />
            {summaryFlags.length > 0 ? (
              <p
                className="text-muted-foreground text-sm"
                data-testid="summary-flags"
              >
                Review: {summaryFlags.join(' · ')}
              </p>
            ) : null}
          </Field>
        )}
      />
    </div>
  );
}
