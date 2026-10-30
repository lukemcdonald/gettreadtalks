'use client';

import { Button } from '@/components/ui';

export function TalkTranscriptEditorFooter({
  canCancel,
  canSave,
  isLoading,
  onCancel,
  onSave,
}: {
  canCancel: boolean;
  canSave: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        data-testid="cancel-transcript"
        disabled={isLoading || !canCancel}
        onClick={onCancel}
        type="button"
        variant="outline"
      >
        Cancel
      </Button>
      <Button
        data-testid="save-transcript"
        disabled={!canSave}
        loading={isLoading}
        onClick={onSave}
        type="button"
      >
        Save
      </Button>
    </div>
  );
}
