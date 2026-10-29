'use client';

import type { TalkStudyContentFormData } from '@/features/talks/schemas/talk-study-form';
import type { TalkId } from '@/features/talks/types';
import type { ReactNode } from 'react';
import type { Control, Resolver, UseFieldArrayReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import {
  Button,
  FormError,
  FormSheetBody,
  TextareaField,
  TextField,
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { updateTalkStudyContentAction } from '@/features/talks/actions/update-talk-study';
import { TalkStudyContent } from '@/features/talks/components/talk-study-content';
import { TalkStudyGenerate } from '@/features/talks/components/talk-study-generate';
import { talkStudyContentFormSchema } from '@/features/talks/schemas/talk-study-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const EMPTY_PASSAGE = { note: '', reference: { text: '' } };
const EMPTY_POINT = {
  body: '',
  heading: '',
  references: [{ text: '' }],
};
const MAX_MAIN_POINTS = 5;
const MAX_POINT_REFS = 3;
const talkStudyContentResolver = zodResolver(
  talkStudyContentFormSchema
) as Resolver<TalkStudyContentFormData>;

function toPreviewKeyPassages(
  passages: TalkStudyContentFormData['keyPassages']
) {
  return passages.map((passage) => ({
    note: passage.note,
    reference: { osis: null, text: passage.reference.text },
  }));
}

function toPreviewMainPoints(points: TalkStudyContentFormData['mainPoints']) {
  return points.map((point) => ({
    body: point.body,
    heading: point.heading,
    references: point.references.map((ref) => ({
      osis: null,
      text: ref.text,
    })),
  }));
}

function ListItemActions({
  canMoveDown,
  canMoveUp,
  label,
  onMoveDown,
  onMoveUp,
  onRemove,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  label: string;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        aria-label={`Move ${label} up`}
        disabled={!canMoveUp}
        onClick={onMoveUp}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <ChevronUpIcon />
      </Button>
      <Button
        aria-label={`Move ${label} down`}
        disabled={!canMoveDown}
        onClick={onMoveDown}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <ChevronDownIcon />
      </Button>
      <Button
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <XIcon />
      </Button>
    </div>
  );
}

function StudyListItem({
  children,
  index,
  kind,
  onMoveDown,
  onMoveUp,
  onRemove,
  total,
}: {
  children: ReactNode;
  index: number;
  kind: 'Passage' | 'Point';
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  total: number;
}) {
  const label = `${kind.toLowerCase()} ${index + 1}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {kind} {index + 1}
        </p>
        <ListItemActions
          canMoveDown={index < total - 1}
          canMoveUp={index > 0}
          label={label}
          onMoveDown={onMoveDown}
          onMoveUp={onMoveUp}
          onRemove={onRemove}
        />
      </div>
      {children}
    </div>
  );
}

function TalkStudyPointFields({
  control,
  index,
  onMoveDown,
  onMoveUp,
  onRemove,
  total,
}: {
  control: Control<TalkStudyContentFormData>;
  index: number;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  total: number;
}) {
  const references = useFieldArray({
    control,
    name: `mainPoints.${index}.references`,
  });

  return (
    <StudyListItem
      index={index}
      kind="Point"
      onMoveDown={onMoveDown}
      onMoveUp={onMoveUp}
      onRemove={onRemove}
      total={total}
    >
      <TextField
        control={control}
        label="Heading"
        name={`mainPoints.${index}.heading`}
      />
      <TextareaField
        control={control}
        label="Body"
        name={`mainPoints.${index}.body`}
        rows={3}
      />
      <div className="space-y-4">
        {references.fields.map((field, refIndex) => (
          <div className="flex items-end gap-2" key={field.id}>
            <div className="min-w-0 flex-1">
              <TextField
                control={control}
                label={`Reference ${refIndex + 1}`}
                name={`mainPoints.${index}.references.${refIndex}.text`}
              />
            </div>
            <Button
              aria-label={`Remove point ${index + 1} reference ${refIndex + 1}`}
              className="mb-1"
              disabled={references.fields.length < 2}
              onClick={() => {
                references.remove(refIndex);
              }}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <XIcon />
            </Button>
          </div>
        ))}
        {references.fields.length < MAX_POINT_REFS ? (
          <Button
            onClick={() => {
              references.append({ text: '' });
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Add reference
          </Button>
        ) : null}
      </div>
    </StudyListItem>
  );
}

function TalkStudyPassageFields({
  control,
  index,
  onMoveDown,
  onMoveUp,
  onRemove,
  total,
}: {
  control: Control<TalkStudyContentFormData>;
  index: number;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  total: number;
}) {
  return (
    <StudyListItem
      index={index}
      kind="Passage"
      onMoveDown={onMoveDown}
      onMoveUp={onMoveUp}
      onRemove={onRemove}
      total={total}
    >
      <TextField
        control={control}
        label="Reference"
        name={`keyPassages.${index}.reference.text`}
      />
      <TextareaField
        control={control}
        label="Note"
        name={`keyPassages.${index}.note`}
        rows={2}
      />
    </StudyListItem>
  );
}

function useTalkStudyContentForm(talkId: TalkId, onSuccess: () => void) {
  const study = useQuery(api.talks.getTalkStudy, { talkId });
  const form = useForm<TalkStudyContentFormData>({
    mode: 'onBlur',
    resolver: talkStudyContentResolver,
    values: {
      keyPassages:
        study?.keyPassages?.map((passage) => ({
          note: passage.note,
          reference: { text: passage.reference.text },
        })) ?? [],
      mainPoints:
        study?.mainPoints?.map((point) => ({
          body: point.body,
          heading: point.heading,
          references: point.references.map((ref) => ({ text: ref.text })),
        })) ?? [],
    },
  });
  const mainPoints = useFieldArray({
    control: form.control,
    name: 'mainPoints',
  });
  const keyPassages = useFieldArray({
    control: form.control,
    name: 'keyPassages',
  });
  const previewKeyPassages = useWatch({
    control: form.control,
    name: 'keyPassages',
  });
  const previewMainPoints = useWatch({
    control: form.control,
    name: 'mainPoints',
  });

  async function handleSubmit(data: TalkStudyContentFormData) {
    const result = await updateTalkStudyContentAction(data, talkId);

    if (!result.success) {
      setServerErrors(form.setError, result.errors);
      return;
    }

    onSuccess();
  }

  return {
    form,
    handleSubmit,
    keyPassages,
    mainPoints,
    previewKeyPassages,
    previewMainPoints,
  };
}

function TalkStudyPointsEditor({
  control,
  mainPoints,
}: {
  control: Control<TalkStudyContentFormData>;
  mainPoints: UseFieldArrayReturn<TalkStudyContentFormData, 'mainPoints'>;
}) {
  return (
    <div className="space-y-6">
      <p className="font-medium">Main points</p>
      {mainPoints.fields.map((field, index) => (
        <TalkStudyPointFields
          control={control}
          index={index}
          key={field.id}
          onMoveDown={() => {
            mainPoints.move(index, index + 1);
          }}
          onMoveUp={() => {
            mainPoints.move(index, index - 1);
          }}
          onRemove={() => {
            mainPoints.remove(index);
          }}
          total={mainPoints.fields.length}
        />
      ))}
      {mainPoints.fields.length < MAX_MAIN_POINTS ? (
        <Button
          onClick={() => {
            mainPoints.append(EMPTY_POINT);
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          Add point
        </Button>
      ) : null}
    </div>
  );
}

function TalkStudyPassagesEditor({
  control,
  keyPassages,
}: {
  control: Control<TalkStudyContentFormData>;
  keyPassages: UseFieldArrayReturn<TalkStudyContentFormData, 'keyPassages'>;
}) {
  return (
    <div className="space-y-6">
      <p className="font-medium">Key passages</p>
      {keyPassages.fields.map((field, index) => (
        <TalkStudyPassageFields
          control={control}
          index={index}
          key={field.id}
          onMoveDown={() => {
            keyPassages.move(index, index + 1);
          }}
          onMoveUp={() => {
            keyPassages.move(index, index - 1);
          }}
          onRemove={() => {
            keyPassages.remove(index);
          }}
          total={keyPassages.fields.length}
        />
      ))}
      <Button
        onClick={() => {
          keyPassages.append(EMPTY_PASSAGE);
        }}
        size="sm"
        type="button"
        variant="outline"
      >
        Add passage
      </Button>
    </div>
  );
}

export function EditTalkStudyPanel({
  hasTranscript,
  onClose,
  onSuccess,
  talkId,
}: {
  hasTranscript: boolean;
  onClose: () => void;
  onSuccess: () => void;
  talkId: TalkId;
}) {
  const {
    form,
    handleSubmit,
    keyPassages,
    mainPoints,
    previewKeyPassages,
    previewMainPoints,
  } = useTalkStudyContentForm(talkId, onSuccess);

  return (
    <form className="contents" onSubmit={form.handleSubmit(handleSubmit)}>
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
        <div className="space-y-8" data-testid="edit-talk-study-panel">
          <FormError error={form.formState.errors.root} />
          <TalkStudyGenerate hasTranscript={hasTranscript} talkId={talkId} />
          <TalkStudyPointsEditor
            control={form.control}
            mainPoints={mainPoints}
          />
          <TalkStudyPassagesEditor
            control={form.control}
            keyPassages={keyPassages}
          />
          <div className="space-y-4" data-testid="talk-study-preview">
            <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              Preview
            </p>
            <TalkStudyContent
              keyPassages={toPreviewKeyPassages(previewKeyPassages ?? [])}
              mainPoints={toPreviewMainPoints(previewMainPoints ?? [])}
            />
          </div>
        </div>
      </FormSheetBody>
    </form>
  );
}
