'use client';

import type { TalkStudyFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkId, TalkStudy, TalkTranscript } from '@/features/talks/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { ManageStatusBadge } from '@/components/manage-table';
import { SectionHeading } from '@/components/section-heading';
import {
  Button,
  FormSheet,
  NumberField,
  SelectField,
  TextField,
  Textarea,
  TextareaField,
} from '@/components/ui';
import {
  setTalkStudyStatusAction,
  updateTalkStudyAction,
} from '@/features/talks/actions/talk-study';
import { talkStudyFormSchema } from '@/features/talks/schemas/talk-study-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const STUDY_GUIDE_KIND_OPTIONS = [
  { label: 'Application', value: 'application' },
  { label: 'Discussion question', value: 'discussion_question' },
  { label: 'Key idea', value: 'key_idea' },
  { label: 'Prayer', value: 'prayer' },
];

interface EditTalkStudySheetProps {
  closeHref?: string;
  study: TalkStudy | null;
  talkId: TalkId;
  transcript: TalkTranscript | null;
}

// fallow-ignore-next-line complexity
export function EditTalkStudySheet({
  closeHref,
  study,
  talkId,
  transcript,
}: EditTalkStudySheetProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TalkStudyFormData>({
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkStudyFormSchema as any),
    values: {
      outline: study?.outline ?? [],
      scriptureRefs: study?.scriptureRefs ?? [],
      studyGuide: study?.studyGuide ?? [],
      suggestedTopics: study?.suggestedTopics.join(', ') ?? '',
      summary: study?.summary ?? '',
    },
  });
  const isPublished = study?.studyStatus === 'published';

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
        <div className="flex items-center justify-between gap-3">
          {study ? (
            <>
              <ManageStatusBadge status={study.studyStatus} />
              <Button
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await setTalkStudyStatusAction(
                      talkId,
                      isPublished ? 'draft' : 'published'
                    );

                    if (!result.success) {
                      setServerErrors(form.setError, result.errors);
                      return;
                    }

                    handleSuccess();
                  });
                }}
                type="button"
                variant={isPublished ? 'outline' : 'default'}
              >
                {isPublished ? 'Unpublish' : 'Publish'}
              </Button>
            </>
          ) : (
            <span className="text-sm">None</span>
          )}
        </div>
        {study ? (
          <>
            <TextareaField
              control={form.control}
              label="Summary"
              name="summary"
              rows={4}
            />
            {study.outline.map((_, index) => (
              <div className="space-y-4" key={index}>
                <TextField
                  control={form.control}
                  label="Outline heading"
                  name={`outline.${index}.heading`}
                />
                <TextareaField
                  control={form.control}
                  label="Outline text"
                  name={`outline.${index}.text`}
                  rows={3}
                />
              </div>
            ))}
            {study.studyGuide.map((_, index) => (
              <div className="space-y-4" key={index}>
                <SelectField
                  control={form.control}
                  label="Study guide kind"
                  name={`studyGuide.${index}.kind`}
                  options={STUDY_GUIDE_KIND_OPTIONS}
                />
                <TextareaField
                  control={form.control}
                  label="Study guide text"
                  name={`studyGuide.${index}.text`}
                  rows={3}
                />
              </div>
            ))}
            {study.scriptureRefs.map((_, index) => (
              <div className="space-y-4" key={index}>
                <TextField
                  control={form.control}
                  label="Book"
                  name={`scriptureRefs.${index}.book`}
                />
                <NumberField
                  control={form.control}
                  label="Chapter"
                  min={1}
                  name={`scriptureRefs.${index}.chapter`}
                />
                <NumberField
                  control={form.control}
                  label="Verse start"
                  min={1}
                  name={`scriptureRefs.${index}.verseStart`}
                />
                <NumberField
                  control={form.control}
                  label="Verse end"
                  min={1}
                  name={`scriptureRefs.${index}.verseEnd`}
                />
              </div>
            ))}
            <TextField
              control={form.control}
              description="Separate topics with commas"
              label="Suggested topics"
              name="suggestedTopics"
            />
          </>
        ) : null}
        {transcript?.text ? (
          <>
            <SectionHeading heading="Transcript" />
            <Textarea readOnly rows={8} value={transcript.text} />
          </>
        ) : null}
      </div>
    </FormSheet>
  );
}
