'use client';

import { Button, FormSheetBody } from '@/components/ui';

export function EditTalkStudyPanel({ onClose }: { onClose: () => void }) {
  return (
    <FormSheetBody
      footer={
        <Button onClick={onClose} type="button" variant="outline">
          Cancel
        </Button>
      }
    >
      <p className="text-sm" data-testid="edit-talk-study-panel">
        No study yet
      </p>
    </FormSheetBody>
  );
}
