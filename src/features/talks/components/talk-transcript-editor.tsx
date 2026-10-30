'use client';

import type { TalkId } from '@/features/talks/types';

import { TalkTranscriptEditorError } from '@/features/talks/components/talk-transcript-editor-error';
import { TalkTranscriptEditorFooter } from '@/features/talks/components/talk-transcript-editor-footer';
import { TalkTranscriptTextarea } from '@/features/talks/components/talk-transcript-textarea';
import { useTalkTranscriptEditor } from '@/features/talks/hooks/use-talk-transcript-editor';

function TalkTranscriptEditorLoaded({ talkId }: { talkId: TalkId }) {
  const editor = useTalkTranscriptEditor(talkId);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <TalkTranscriptTextarea
        disabled={!editor.isReady || editor.isLoading}
        onChange={editor.handleChange}
        value={editor.text}
      />
      <TalkTranscriptEditorError error={editor.error} />
      <TalkTranscriptEditorFooter
        canCancel={editor.canCancel}
        canSave={editor.canSave}
        isLoading={editor.isLoading}
        onCancel={editor.handleCancel}
        onSave={editor.handleSave}
      />
    </div>
  );
}

export function TalkTranscriptEditor({
  active,
  talkId,
}: {
  active: boolean;
  talkId: TalkId;
}) {
  if (!active) {
    return null;
  }

  return <TalkTranscriptEditorLoaded talkId={talkId} />;
}
