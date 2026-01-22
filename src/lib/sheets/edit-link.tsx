import type { ComponentProps } from 'react';
import type { ClipId } from '@/features/clips/types';
import type { CollectionId } from '@/features/collections/types';
import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';

import Link from 'next/link';

import { buildSheetParam } from './utils';

type LinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

interface EditTalkLinkProps extends LinkProps {
  talkId: TalkId;
}

export function EditTalkLink({ talkId, children, ...props }: EditTalkLinkProps) {
  const sheetParam = buildSheetParam('talk', 'edit', talkId);
  return (
    <Link href={`?sheet=${sheetParam}`} {...props}>
      {children}
    </Link>
  );
}

interface EditSpeakerLinkProps extends LinkProps {
  speakerId: SpeakerId;
}

export function EditSpeakerLink({ speakerId, children, ...props }: EditSpeakerLinkProps) {
  const sheetParam = buildSheetParam('speaker', 'edit', speakerId);
  return (
    <Link href={`?sheet=${sheetParam}`} {...props}>
      {children}
    </Link>
  );
}

interface EditClipLinkProps extends LinkProps {
  clipId: ClipId;
}

export function EditClipLink({ clipId, children, ...props }: EditClipLinkProps) {
  const sheetParam = buildSheetParam('clip', 'edit', clipId);
  return (
    <Link href={`?sheet=${sheetParam}`} {...props}>
      {children}
    </Link>
  );
}

interface EditCollectionLinkProps extends LinkProps {
  collectionId: CollectionId;
}

export function EditCollectionLink({ collectionId, children, ...props }: EditCollectionLinkProps) {
  const sheetParam = buildSheetParam('collection', 'edit', collectionId);
  return (
    <Link href={`?sheet=${sheetParam}`} {...props}>
      {children}
    </Link>
  );
}

interface EditTopicLinkProps extends LinkProps {
  topicId: TopicId;
}

export function EditTopicLink({ topicId, children, ...props }: EditTopicLinkProps) {
  const sheetParam = buildSheetParam('topic', 'edit', topicId);
  return (
    <Link href={`?sheet=${sheetParam}`} {...props}>
      {children}
    </Link>
  );
}

interface NewEntityLinkProps extends LinkProps {
  entity: 'talk' | 'speaker' | 'clip' | 'collection' | 'topic';
}

export function NewEntityLink({ entity, children, ...props }: NewEntityLinkProps) {
  const sheetParam = buildSheetParam(entity, 'new');
  return (
    <Link href={`?sheet=${sheetParam}`} {...props}>
      {children}
    </Link>
  );
}
