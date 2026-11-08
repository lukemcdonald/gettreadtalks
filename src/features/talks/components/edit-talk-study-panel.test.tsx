/// <reference types="vitest/globals" />

import type { TalkFeatureFormData } from '@/features/talks/schemas/talk-study-form';

import { StudyStatusSelect } from '@/features/talks/components/study-status-select';
import { describe, expect, it, render, screen } from '@/test';

import {
  TalkStudyBodyField,
  useTalkStudyEditorForm,
} from './edit-talk-study-panel';

vi.mock('@/features/talks/actions/update-talk-study', () => ({
  updateTalkFeatureAction: vi.fn(),
}));

function StudyEditor({
  feature,
}: {
  feature: {
    body?: string;
    status?: TalkFeatureFormData['status'];
  } | null;
}) {
  const form = useTalkStudyEditorForm(feature);

  return (
    <>
      <TalkStudyBodyField control={form.control} warningText={null} />
      <StudyStatusSelect control={form.control} name="status" />
    </>
  );
}

describe('talk study editor', () => {
  it('keeps typed study edits and updates an untouched status from a live draft', async () => {
    const view = render(<StudyEditor feature={null} />);
    const field = screen.getByTestId('talk-study-field');

    await view.type(field, 'My unsaved study');
    view.rerender(
      <StudyEditor
        feature={{
          body: 'Generated study.',
          status: 'published',
        }}
      />
    );

    expect(screen.getByTestId('talk-study-field')).toHaveValue(
      'My unsaved study'
    );
    expect(screen.getByTestId('talk-study-status')).toHaveAttribute(
      'data-status',
      'published'
    );
  });
});
