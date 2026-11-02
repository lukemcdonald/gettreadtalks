'use client';

import type { TalkFeature } from '@/features/talks/types';
import type { EditTalkTab } from '@/features/talks/utils';

import { ManageStatusDot } from '@/components/manage-table/manage-status-badge';
import { Tabs, TabsList, TabsTab } from '@/components/ui';

interface EditTalkTabsProps {
  onValueChange: (tab: EditTalkTab) => void;
  studyStatus?: TalkFeature['status'] | null;
  value: EditTalkTab;
}

export function EditTalkTabs({
  onValueChange,
  studyStatus,
  value,
}: EditTalkTabsProps) {
  return (
    <Tabs
      onValueChange={(next) => {
        if (next === 'content' || next === 'study' || next === 'transcript') {
          onValueChange(next);
        }
      }}
      value={value}
    >
      <TabsList
        aria-label="Edit talk sections"
        className="w-full justify-start"
        variant="underline"
      >
        <TabsTab
          className="grow-0"
          data-testid="edit-talk-tab-content"
          value="content"
        >
          Content
        </TabsTab>
        <TabsTab
          className="grow-0"
          data-testid="edit-talk-tab-study"
          value="study"
        >
          Study
          {studyStatus ? <ManageStatusDot status={studyStatus} /> : null}
        </TabsTab>
        <TabsTab
          className="grow-0"
          data-testid="edit-talk-tab-transcript"
          value="transcript"
        >
          Transcript
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
