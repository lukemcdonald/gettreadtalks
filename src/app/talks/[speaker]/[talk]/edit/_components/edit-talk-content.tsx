'use client';

import type { Doc } from '@/convex/_generated/dataModel';
import type { StatusType } from '@/convex/lib/validators/shared';
import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { TalkForm } from '@/app/talks/new/_components/talk-form';
import { ContentActionsGroup } from '@/components/actions-group';
import { useArchiveTalk, useDestroyTalk } from '@/features/talks/hooks';

type EditTalkContentProps = {
  collections: Pick<Collection, '_id' | 'slug' | 'title'>[];
  initialData: {
    collectionId?: CollectionId;
    collectionOrder?: number;
    description?: string;
    featured?: boolean;
    mediaUrl: string;
    scripture?: string;
    speakerId: SpeakerId;
    status?: StatusType;
    title: string;
  };
  speakerSlug?: string;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug' | 'imageUrl' | 'role'>[];
  talk: Doc<'talks'>;
  talkSlug: string;
};

export function EditTalkContent({
  collections,
  initialData,
  speakerSlug,
  speakers,
  talk,
  talkSlug,
}: EditTalkContentProps) {
  const archiveTalk = useArchiveTalk();
  const destroyTalk = useDestroyTalk();

  const talkUrl = `/talks/${speakerSlug}/${talkSlug}`;

  const handleArchive = async () => {
    await archiveTalk.mutateAsync({ id: talk._id });
  };

  const handleDelete = async () => {
    await destroyTalk.mutateAsync({ id: talk._id });
  };

  return (
    <TalkForm
      actionsMenu={
        <ContentActionsGroup
          content={talk}
          contentType="talk"
          editUrl={undefined}
          listUrl="/account/talks"
          onArchive={handleArchive}
          onDelete={handleDelete}
          primaryAction={{
            label: 'Save',
            type: 'submit',
          }}
          viewUrl={talkUrl}
        />
      }
      collections={collections}
      initialData={initialData}
      mode="edit"
      speakerSlug={speakerSlug}
      speakers={speakers}
      talkId={talk._id}
      talkSlug={talkSlug}
    />
  );
}
