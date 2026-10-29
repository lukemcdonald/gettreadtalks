'use client';

import type { TalkFeatureFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkFeature, TalkId } from '@/features/talks/types';
import type { Control, Resolver, UseFormSetError } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  Button,
  Field,
  FieldError,
  FieldLabel,
  FormError,
  FormSheetBody,
  Textarea,
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { getMissingStudyTemplateHeadings } from '@/convex/model/talkFeatures/study/template';
import { updateTalkFeatureAction } from '@/features/talks/actions/update-talk-study';
import { StudyStatusSelect } from '@/features/talks/components/study-status-select';
import { TalkStudyContent } from '@/features/talks/components/talk-study-content';
import { TalkStudyGenerate } from '@/features/talks/components/talk-study-generate';
import { talkFeatureFormSchema } from '@/features/talks/schemas/talk-study-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const EMPTY_STUDY_FEATURE: TalkFeatureFormData = {
  body: '',
  status: 'draft',
};
const talkFeatureResolver = zodResolver(
  talkFeatureFormSchema
) as Resolver<TalkFeatureFormData>;

function getTalkFeatureFormValues(feature: {
  body?: string;
  status?: TalkFeatureFormData['status'];
}): TalkFeatureFormData {
  return {
    body: feature.body ?? EMPTY_STUDY_FEATURE.body,
    status: feature.status ?? EMPTY_STUDY_FEATURE.status,
  };
}

async function saveTalkFeature(
  data: TalkFeatureFormData,
  onSuccess: () => void,
  setError: UseFormSetError<TalkFeatureFormData>,
  talkId: TalkId
) {
  const result = await updateTalkFeatureAction(data, talkId);

  if (!result.success) {
    setServerErrors(setError, result.errors);
    return;
  }

  onSuccess();
}

function getStudyTemplateWarning(body: string) {
  const missingHeadings = getMissingStudyTemplateHeadings(body);

  if (!body.trim() || missingHeadings.length === 0) {
    return null;
  }

  return `Missing template headings: ${missingHeadings.join(', ')}.`;
}

function TalkStudyBodyField({
  control,
  warningText,
}: {
  control: Control<TalkFeatureFormData>;
  warningText: string | null;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between gap-2">
        <Field className="contents">
          <FieldLabel htmlFor="body">Study</FieldLabel>
        </Field>
        <StudyStatusSelect control={control} name="status" />
      </div>
      <Controller
        control={control}
        name="body"
        render={({ field, fieldState }) => (
          <Field
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <Textarea
              className="[&_[data-slot=textarea]]:field-sizing-fixed [&_[data-slot=textarea]]:min-h-64"
              rows={16}
              size="lg"
              {...field}
              aria-invalid={fieldState.invalid}
              id={field.name}
            />
            {fieldState.error ? (
              <FieldError match>{fieldState.error.message}</FieldError>
            ) : null}
            {warningText ? (
              <p
                className="text-muted-foreground text-sm"
                data-testid="study-template-warning"
              >
                {warningText}
              </p>
            ) : null}
          </Field>
        )}
      />
    </div>
  );
}

export function EditTalkStudyPanel({
  feature: initialFeature,
  hasTranscript,
  onClose,
  onSuccess,
  talkId,
}: {
  feature?: TalkFeature | null;
  hasTranscript: boolean;
  onClose: () => void;
  onSuccess: () => void;
  talkId: TalkId;
}) {
  const liveFeature = useQuery(api.talkFeatures.get, { kind: 'study', talkId });
  const feature = liveFeature === undefined ? initialFeature : liveFeature;
  const form = useForm<TalkFeatureFormData>({
    mode: 'onBlur',
    resolver: talkFeatureResolver,
    values: getTalkFeatureFormValues(feature ?? EMPTY_STUDY_FEATURE),
  });
  const previewBody = useWatch({
    control: form.control,
    name: 'body',
  });

  return (
    <form
      className="contents"
      onSubmit={form.handleSubmit((data) =>
        saveTalkFeature(data, onSuccess, form.setError, talkId)
      )}
    >
      <FormSheetBody
        footer={
          <>
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button loading={form.formState.isSubmitting} type="submit">
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-6" data-testid="edit-talk-study-panel">
          <FormError error={form.formState.errors.root} />
          <TalkStudyGenerate hasTranscript={hasTranscript} talkId={talkId} />
          <TalkStudyBodyField
            control={form.control}
            warningText={getStudyTemplateWarning(previewBody ?? '')}
          />
          <div className="space-y-4" data-testid="talk-study-preview">
            <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              Preview
            </p>
            <TalkStudyContent body={previewBody} />
          </div>
        </div>
      </FormSheetBody>
    </form>
  );
}
