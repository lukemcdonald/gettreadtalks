'use client';

import type { EditTalkFormData } from '@/features/talks/schemas/talk-form';
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
  control: Control<EditTalkFormData>;
  isPending: boolean;
  onSetStatus: (studyStatus: TalkStudy['studyStatus']) => void;
  study: TalkStudy;
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
  const isPublished = study.studyStatus === 'published';

  return (
    <div className="space-y-4">
      <SectionHeading heading="Study" />
      <div className="flex items-center justify-between gap-3">
        <ManageStatusBadge status={study.studyStatus} />
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
      </div>
      <TextareaField
        control={control}
        label="Summary"
        name="study.summary"
        rows={4}
      />
      {study.outline.map((_, index) => (
        <div className="space-y-4" key={index}>
          <TextField
            control={control}
            label="Outline heading"
            name={`study.outline.${index}.heading`}
          />
          <TextareaField
            control={control}
            label="Outline text"
            name={`study.outline.${index}.text`}
            rows={3}
          />
        </div>
      ))}
      {study.studyGuide.map((_, index) => (
        <div className="space-y-4" key={index}>
          <SelectField
            control={control}
            label="Study guide kind"
            name={`study.studyGuide.${index}.kind`}
            options={STUDY_GUIDE_KIND_OPTIONS}
          />
          <TextareaField
            control={control}
            label="Study guide text"
            name={`study.studyGuide.${index}.text`}
            rows={3}
          />
        </div>
      ))}
      {study.scriptureRefs.map((_, index) => (
        <div className="space-y-4" key={index}>
          <TextField
            control={control}
            label="Book"
            name={`study.scriptureRefs.${index}.book`}
          />
          <NumberField
            control={control}
            label="Chapter"
            min={1}
            name={`study.scriptureRefs.${index}.chapter`}
          />
          <NumberField
            control={control}
            label="Verse start"
            min={1}
            name={`study.scriptureRefs.${index}.verseStart`}
          />
          <NumberField
            control={control}
            label="Verse end"
            min={1}
            name={`study.scriptureRefs.${index}.verseEnd`}
          />
        </div>
      ))}
      <TextField
        control={control}
        description="Separate topics with commas"
        label="Suggested topics"
        name="study.suggestedTopics"
      />
      {transcript?.text ? (
        <>
          <SectionHeading heading="Transcript" />
          <Textarea readOnly rows={8} value={transcript.text} />
        </>
      ) : null}
    </div>
  );
}
