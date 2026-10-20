'use client';

import type { EditTalkFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkStudy } from '@/features/talks/types';
import type { Control } from 'react-hook-form';

import { useFieldArray } from 'react-hook-form';

import { ManageStatusBadge } from '@/components/manage-table';
import { SectionHeading } from '@/components/section-heading';
import {
  Button,
  NumberField,
  SelectField,
  TextField,
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
  onPublish: () => void;
  onUnpublish: () => void;
  studyStatus: TalkStudy['studyStatus'];
}

function OutlineFields({ control }: { control: Control<EditTalkFormData> }) {
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'study.outline',
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div className="space-y-4" key={field.id}>
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
          <Button
            onClick={() => {
              remove(index);
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Remove outline item
          </Button>
        </div>
      ))}
      <Button
        onClick={() => {
          append({ heading: '', text: '' });
        }}
        size="sm"
        type="button"
        variant="outline"
      >
        Add outline item
      </Button>
    </div>
  );
}

function StudyGuideFields({ control }: { control: Control<EditTalkFormData> }) {
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'study.studyGuide',
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div className="space-y-4" key={field.id}>
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
          <Button
            onClick={() => {
              remove(index);
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Remove study guide section
          </Button>
        </div>
      ))}
      <Button
        onClick={() => {
          append({ kind: 'key_idea', text: '' });
        }}
        size="sm"
        type="button"
        variant="outline"
      >
        Add study guide section
      </Button>
    </div>
  );
}

function ScriptureRefFields({
  control,
}: {
  control: Control<EditTalkFormData>;
}) {
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'study.scriptureRefs',
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div className="space-y-4" key={field.id}>
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
          <Button
            onClick={() => {
              remove(index);
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Remove scripture
          </Button>
        </div>
      ))}
      <Button
        onClick={() => {
          append({ book: '', chapter: 1 });
        }}
        size="sm"
        type="button"
        variant="outline"
      >
        Add scripture
      </Button>
    </div>
  );
}

export function TalkStudyFields({
  control,
  isPending,
  onPublish,
  onUnpublish,
  studyStatus,
}: TalkStudyFieldsProps) {
  return (
    <div className="space-y-4">
      <SectionHeading heading="Study" />
      <div className="flex items-center justify-between gap-3">
        <ManageStatusBadge status={studyStatus} />
        {studyStatus === 'published' ? (
          <Button
            disabled={isPending}
            onClick={onUnpublish}
            type="button"
            variant="outline"
          >
            Unpublish
          </Button>
        ) : (
          <Button disabled={isPending} onClick={onPublish} type="button">
            Publish
          </Button>
        )}
      </div>
      <TextareaField
        control={control}
        label="Summary"
        name="study.summary"
        rows={4}
      />
      <OutlineFields control={control} />
      <StudyGuideFields control={control} />
      <ScriptureRefFields control={control} />
      <TextField
        control={control}
        description="Separate topics with commas"
        label="Suggested topics"
        name="study.suggestedTopics"
      />
    </div>
  );
}
