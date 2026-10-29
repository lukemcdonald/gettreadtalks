'use client';

import type { TalkStudyFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkId } from '@/features/talks/types';
import type { Control, UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Field,
  FieldError,
  FieldLabel,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { updateTalkStudyAction } from '@/features/talks/actions/update-talk-study';
import { TalkSummaryGenerate } from '@/features/talks/components/talk-summary-generate';
import { talkStudyFormSchema } from '@/features/talks/schemas/talk-study-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const STUDY_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

function StudyStatusSelect({
  control,
}: {
  control: Control<TalkStudyFormData>;
}) {
  return (
    <Controller
      control={control}
      name="studyStatus"
      render={({ field }) => (
        <Select
          items={STUDY_STATUS_OPTIONS}
          name={field.name}
          onValueChange={(nextValue) => {
            field.onChange(nextValue ?? 'draft');
          }}
          value={field.value}
        >
          <SelectTrigger
            aria-label="Status"
            className="w-auto min-w-24"
            id={field.name}
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {STUDY_STATUS_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      )}
    />
  );
}

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
          <div className="flex w-full items-center justify-between gap-2">
            <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
            <StudyStatusSelect control={form.control} />
          </div>
          <Textarea
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
  );
}
