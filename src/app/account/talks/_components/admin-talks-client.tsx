'use client';

import type { CollectionId, CollectionListItem } from '@/features/collections/types';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { Talk, TalkId, TalkStatus } from '@/features/talks/types';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui';
import { CreateTalkSheet, EditTalkSheet } from '@/features/talks/components';

interface TalkData {
  _id: TalkId;
  collectionId?: CollectionId;
  collectionOrder?: number;
  description?: string;
  featured?: boolean;
  mediaUrl: string;
  scripture?: string;
  speakerId: SpeakerId;
  status?: TalkStatus;
  title: string;
}

interface AdminTalksClientProps {
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
}

export function AdminTalksClient({ collections, speakers }: AdminTalksClientProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTalk, setEditTalk] = useState<TalkData | null>(null);

  const handleTalkCreated = (_talkId: TalkId) => {
    router.refresh();
  };

  const handleTalkUpdated = (_talkId: TalkId) => {
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setIsCreateOpen(true)} size="sm">
        <PlusIcon className="size-4" />
        New Talk
      </Button>

      <CreateTalkSheet
        collections={collections}
        onOpenChange={setIsCreateOpen}
        onTalkCreated={handleTalkCreated}
        open={isCreateOpen}
        speakers={speakers}
      />

      <EditTalkSheet
        collections={collections}
        onOpenChange={(open) => {
          if (!open) {
            setEditTalk(null);
          }
        }}
        onTalkUpdated={handleTalkUpdated}
        open={editTalk !== null}
        speakers={speakers}
        talk={editTalk}
      />
    </>
  );
}

export function useAdminTalksClient() {
  const [editTalk, setEditTalk] = useState<TalkData | null>(null);

  return {
    editTalk,
    openEditSheet: (talk: TalkData) => setEditTalk(talk),
  };
}
