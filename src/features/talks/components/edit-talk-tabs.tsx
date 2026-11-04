'use client';

import type { TalkFeature } from '@/features/talks/types';
import type { EditTalkTab } from '@/features/talks/utils';

import { ManageStatusDot } from '@/components/manage-table/manage-status-badge';
import { Spinner, Tabs, TabsList, TabsTab } from '@/components/ui';

type DraftStepStatus = 'failed' | 'pending';

interface EditTalkTabsProps {
  onValueChange: (tab: EditTalkTab) => void;
  studyMessage?: string;
  studyStatus?: TalkFeature['status'] | null;
  studyStepStatus?: DraftStepStatus;
  summaryMessage?: string;
  summaryStepStatus?: DraftStepStatus;
  transcriptMessage?: string;
  transcriptStepStatus?: DraftStepStatus;
  value: EditTalkTab;
}

function DraftStepMark({
  label,
  message,
  status,
}: {
  label: string;
  message?: string;
  status?: DraftStepStatus;
}) {
  if (status === 'pending') {
    return (
      <Spinner aria-label={`${label} in progress`} className="ms-1.5 size-3" />
    );
  }

  if (status === 'failed') {
    return (
      <span className="text-destructive ms-1.5 text-xs" title={message}>
        Failed
      </span>
    );
  }

  return null;
}

export function EditTalkTabs({
  onValueChange,
  studyMessage,
  studyStatus,
  studyStepStatus,
  summaryMessage,
  summaryStepStatus,
  transcriptMessage,
  transcriptStepStatus,
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
          <DraftStepMark
            label="Summary"
            message={summaryMessage}
            status={summaryStepStatus}
          />
        </TabsTab>
        <TabsTab
          className="grow-0"
          data-testid="edit-talk-tab-study"
          value="study"
        >
          Study
          {studyStatus && !studyStepStatus ? (
            <ManageStatusDot className="ms-1.5" status={studyStatus} />
          ) : null}
          <DraftStepMark
            label="Study"
            message={studyMessage}
            status={studyStepStatus}
          />
        </TabsTab>
        <TabsTab
          className="grow-0"
          data-testid="edit-talk-tab-transcript"
          value="transcript"
        >
          Transcript
          <DraftStepMark
            label="Transcript"
            message={transcriptMessage}
            status={transcriptStepStatus}
          />
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
