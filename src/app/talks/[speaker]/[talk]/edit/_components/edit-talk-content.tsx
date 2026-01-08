'use client';

import type { Collection, CollectionId } from '@/features/collections/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';
import type { Talk, TalkStatus } from '@/features/talks/types';

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
    status?: TalkStatus;
    title: string;
  };
  speakerSlug?: string;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug' | 'imageUrl' | 'role'>[];
  talk: Talk;
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
      actionsMenu={({ isBusy }) => (
        <ContentActionsGroup
          content={talk}
          contentType="talk"
          disabled={isBusy}
          editUrl={undefined}
          listUrl="/account/talks"
          onArchiveAction={handleArchive}
          onDeleteAction={handleDelete}
          primaryAction={{
            label: 'Save',
            loading: isBusy,
            loadingLabel: 'Saving...',
            type: 'submit',
          }}
          viewUrl={talkUrl}
        />
      )}
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
