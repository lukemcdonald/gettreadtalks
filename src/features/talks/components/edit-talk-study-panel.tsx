'use client';

import type { TalkFeatureFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkFeature, TalkId } from '@/features/talks/types';
import type { Control, Resolver, UseFormSetError } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  Button,
  Field,
  FieldError,
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

function TalkStudyToolbar({
  canGenerate,
  control,
  hasTranscript,
  isEditing,
  onGenerated,
  onToggleEditing,
  talkId,
}: {
  canGenerate: boolean;
  control: Control<TalkFeatureFormData>;
  hasTranscript: boolean;
  isEditing: boolean;
  onGenerated: () => void;
  onToggleEditing: () => void;
  talkId: TalkId;
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <TalkStudyGenerate
        canGenerate={canGenerate}
        hasTranscript={hasTranscript}
        onGenerated={onGenerated}
        talkId={talkId}
      />
      <Button
        className="shrink-0"
        onClick={onToggleEditing}
        size="sm"
        type="button"
        variant="outline"
      >
        {isEditing ? 'Done' : 'Edit'}
      </Button>
      <div className="ml-auto">
        <StudyStatusSelect control={control} name="status" />
      </div>
    </div>
  );
}

function TalkStudyBodyField({
  control,
  warningText,
}: {
  control: Control<TalkFeatureFormData>;
  warningText: string | null;
}) {
  return (
    <Controller
      control={control}
      name="body"
      render={({ field, fieldState }) => (
        <Field
          className="min-h-0 w-full flex-1"
          dirty={fieldState.isDirty}
          invalid={fieldState.invalid}
          name={field.name}
          touched={fieldState.isTouched}
        >
          <Textarea
            className="grid min-h-40 w-full min-w-0 flex-1 grid-cols-1 grid-rows-1 sm:min-h-64 [&_[data-slot=textarea]]:field-sizing-fixed [&_[data-slot=textarea]]:h-full [&_[data-slot=textarea]]:min-h-0 [&_[data-slot=textarea]]:min-w-0 [&_[data-slot=textarea]]:resize-none"
            size="lg"
            {...field}
            aria-invalid={fieldState.invalid}
            aria-label="Study"
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
  );
}

function TalkStudyPanelBody({
  body,
  control,
  isEditing,
}: {
  body: string;
  control: Control<TalkFeatureFormData>;
  isEditing: boolean;
}) {
  if (isEditing) {
    return (
      <TalkStudyBodyField
        control={control}
        warningText={getStudyTemplateWarning(body)}
      />
    );
  }

  return <TalkStudyContent body={body} />;
}

function useTalkStudyPanelForm({
  initialFeature,
  talkId,
}: {
  initialFeature?: TalkFeature | null;
  talkId: TalkId;
}) {
  const liveFeature = useQuery(api.talkFeatures.getTalkFeature, {
    kind: 'study',
    talkId,
  });
  const feature = liveFeature === undefined ? initialFeature : liveFeature;
  const [isEditing, setIsEditing] = useState(!initialFeature?.body?.trim());
  const form = useForm<TalkFeatureFormData>({
    mode: 'onBlur',
    resolver: talkFeatureResolver,
    values: getTalkFeatureFormValues(feature ?? EMPTY_STUDY_FEATURE),
  });
  const body = useWatch({
    control: form.control,
    name: 'body',
  });

  return {
    body,
    form,
    isEditing,
    setIsEditing,
  };
}

export function EditTalkStudyPanel({
  canGenerate,
  feature: initialFeature,
  hasTranscript,
  onClose,
  onSuccess,
  talkId,
}: {
  canGenerate: boolean;
  feature?: TalkFeature | null;
  hasTranscript: boolean;
  onClose: () => void;
  onSuccess: () => void;
  talkId: TalkId;
}) {
  const { body, form, isEditing, setIsEditing } = useTalkStudyPanelForm({
    initialFeature,
    talkId,
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
        scrollable={!isEditing}
      >
        <div
          className="flex min-h-0 flex-1 flex-col gap-4"
          data-testid="edit-talk-study-panel"
        >
          <FormError error={form.formState.errors.root} />
          <TalkStudyToolbar
            canGenerate={canGenerate}
            control={form.control}
            hasTranscript={hasTranscript}
            isEditing={isEditing}
            onGenerated={() => {
              setIsEditing(false);
            }}
            onToggleEditing={() => {
              setIsEditing((current) => !current);
            }}
            talkId={talkId}
          />
          <TalkStudyPanelBody
            body={body ?? ''}
            control={form.control}
            isEditing={isEditing}
          />
        </div>
      </FormSheetBody>
    </form>
  );
}
