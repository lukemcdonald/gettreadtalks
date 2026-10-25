'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { TalkId, TalkStudy } from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';
import type { UseFormReturn } from 'react-hook-form';

import { ManageStatusBadge } from '@/components/manage-table';
import { Link } from '@/components/ui/link';
import { TalkFormFields } from '@/features/talks/components/talk-form-fields';
import { buildTalkStudyPath } from '@/features/talks/utils';

interface EditTalkFieldsProps {
  collections: CollectionListItem[];
  form: UseFormReturn<TalkFormData>;
  speakers: SpeakerListItem[];
  studyStatus?: TalkStudy['studyStatus'] | null;
  talkId: TalkId;
  topics: TopicListItem[];
}

export function EditTalkFields({
  collections,
  form,
  speakers,
  studyStatus,
  talkId,
  topics,
}: EditTalkFieldsProps) {
  return (
    <div className="space-y-4">
      <TalkFormFields
        collections={collections}
        control={form.control}
        mode="edit"
        setValue={form.setValue}
        speakers={speakers}
        topics={topics}
      />
      <Link
        className="flex items-center justify-between gap-3 text-sm"
        data-testid="edit-talk-study"
        href={buildTalkStudyPath(talkId)}
      >
        <span className="font-medium">Study</span>
        {studyStatus ? <ManageStatusBadge status={studyStatus} /> : 'None'}
      </Link>
    </div>
  );
}
