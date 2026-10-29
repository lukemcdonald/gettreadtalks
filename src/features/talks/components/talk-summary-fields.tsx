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
import { updateTalkSummaryAction } from '@/features/talks/actions/update-talk-study';
import { TalkSummaryGenerate } from '@/features/talks/components/talk-summary-generate';
import { talkSummaryFormSchema } from '@/features/talks/schemas/talk-study-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

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
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkSummaryFormSchema as any),
    values: {
      summary: talkDoc?.summary ?? '',
    },
  });

  async function save() {
    if (!form.formState.isDirty) {
      return { success: true as const };
    }

    const result = await updateTalkSummaryAction(form.getValues(), talkId);

    if (!result.success) {
      setServerErrors(form.setError, result.errors);
    }

    return result;
  }

  return {
    form,
    handleFlagsChange: setSummaryFlags,
    hasTranscript:
      transcript === undefined ? hasTranscriptPrefill : Boolean(transcript),
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
