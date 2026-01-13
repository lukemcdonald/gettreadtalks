import type { ReactNode } from 'react';
import type { ClipId } from '@/features/clips/types';
import type { CollectionId } from '@/features/collections/types';
import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId, TalkStatus } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';

export type ActionsGroupMenuItem = {
  disabled?: boolean;
  hidden?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  separator?: boolean;
  variant?: 'default' | 'destructive';
};

export type PrimaryAction = {
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
};

export type ActionsGroupProps = {
  disabled?: boolean;
  menuItems: ActionsGroupMenuItem[];
  primaryAction?: PrimaryAction;
};

type ContentId = TalkId | ClipId | CollectionId | SpeakerId | TopicId;
type ContentType = 'talk' | 'clip' | 'collection' | 'speaker' | 'topic';

export type ContentActionsGroupProps = {
  additionalActions?: ActionsGroupMenuItem[];
  content: {
    _id: ContentId;
    status?: TalkStatus;
    title?: string;
  };
  contentType: ContentType;
  disabled?: boolean;
  editUrl?: string;
  listUrl?: string;
  onArchiveAction?: (id: ContentId) => Promise<void>;
  onDeleteAction?: (id: ContentId) => Promise<void>;
  primaryAction?: PrimaryAction;
  viewUrl?: string;
};
