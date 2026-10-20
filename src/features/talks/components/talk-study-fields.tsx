'use client';

import type { TalkStudyFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkStudy, TalkTranscript } from '@/features/talks/types';
import type { Control } from 'react-hook-form';

import { ManageStatusBadge } from '@/components/manage-table';
import { SectionHeading } from '@/components/section-heading';
import {
  Button,
  NumberField,
  SelectField,
  TextField,
  Textarea,
  TextareaField,
} from '@/components/ui';

const STUDY_GUIDE_KIND_OPTIONS = [
  { label: 'Application', value: 'application' },
  { label: 'Discussion question', value: 'discussion_question' },
  { label: 'Key idea', value: 'key_idea' },
  { label: 'Prayer', value: 'prayer' },
];

interface TalkStudyFieldsProps {
  control: Control<TalkStudyFormData>;
  isPending: boolean;
  onSetStatus: (studyStatus: TalkStudy['studyStatus']) => void;
  study: TalkStudy | null;
  transcript: TalkTranscript | null;
}

// fallow-ignore-next-line complexity
export function TalkStudyFields({
  control,
  isPending,
  onSetStatus,
  study,
  transcript,
}: TalkStudyFieldsProps) {
  const isPublished = study?.studyStatus === 'published';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        {study ? (
          <ManageStatusBadge status={study.studyStatus} />
        ) : (
          <span className="text-sm">None</span>
        )}
        {study ? (
          <Button
            disabled={isPending}
            onClick={() => {
              onSetStatus(isPublished ? 'draft' : 'published');
            }}
            type="button"
            variant={isPublished ? 'outline' : 'default'}
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        ) : null}
      </div>
      {study ? (
        <>
          <TextareaField
            control={control}
            label="Summary"
            name="summary"
            rows={4}
          />
          {study.outline.map((_, index) => (
            <div className="space-y-4" key={index}>
              <TextField
                control={control}
                label="Outline heading"
                name={`outline.${index}.heading`}
              />
              <TextareaField
                control={control}
                label="Outline text"
                name={`outline.${index}.text`}
                rows={3}
              />
            </div>
          ))}
          {study.studyGuide.map((_, index) => (
            <div className="space-y-4" key={index}>
              <SelectField
                control={control}
                label="Study guide kind"
                name={`studyGuide.${index}.kind`}
                options={STUDY_GUIDE_KIND_OPTIONS}
              />
              <TextareaField
                control={control}
                label="Study guide text"
                name={`studyGuide.${index}.text`}
                rows={3}
              />
            </div>
          ))}
          {study.scriptureRefs.map((_, index) => (
            <div className="space-y-4" key={index}>
              <TextField
                control={control}
                label="Book"
                name={`scriptureRefs.${index}.book`}
              />
              <NumberField
                control={control}
                label="Chapter"
                min={1}
                name={`scriptureRefs.${index}.chapter`}
              />
              <NumberField
                control={control}
                label="Verse start"
                min={1}
                name={`scriptureRefs.${index}.verseStart`}
              />
              <NumberField
                control={control}
                label="Verse end"
                min={1}
                name={`scriptureRefs.${index}.verseEnd`}
              />
            </div>
          ))}
          <TextField
            control={control}
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
  );
}
