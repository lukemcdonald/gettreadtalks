/// <reference types="vitest/globals" />

import type { TalkId } from '@/features/talks/types';

import { describe, expect, it, render, screen } from '@/test';

import {
  TalkSummaryFields,
  useTalkSummaryEditorForm,
} from './talk-summary-fields';

vi.mock('@/features/talks/components/talk-summary-generate', () => ({
  TalkSummaryGenerate: () => <div data-testid="talk-summary-generate" />,
}));

const talkId = 'talks:summary-editor' as TalkId;

function SummaryEditor({
  talk,
}: {
  talk: {
    draftSummary?: string;
    summary?: string;
  } | null;
}) {
  const form = useTalkSummaryEditorForm(talk);

  return (
    <TalkSummaryFields
      canGenerate
      form={form}
      hasTranscript
      onFlagsChange={() => {}}
      summaryFlags={[]}
      talkId={talkId}
    />
  );
}

describe('TalkSummaryFields', () => {
  it('keeps typed unsaved edits when a live draft arrives', async () => {
    const view = render(<SummaryEditor talk={null} />);
    const field = screen.getByTestId('talk-summary-field');

    await view.type(field, 'My unsaved summary');
    view.rerender(
      <SummaryEditor talk={{ draftSummary: 'Generated draft.' }} />
    );

    expect(screen.getByTestId('talk-summary-field')).toHaveValue(
      'My unsaved summary'
    );
  });

  it('fills an untouched summary from an arriving draft', () => {
    const view = render(<SummaryEditor talk={null} />);

    view.rerender(
      <SummaryEditor talk={{ draftSummary: 'Generated draft.' }} />
    );

    expect(screen.getByTestId('talk-summary-field')).toHaveValue(
      'Generated draft.'
    );
  });
});
