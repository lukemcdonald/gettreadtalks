import type { ReactNode } from 'react';
import type { StatusType } from '@/convex/lib/types';
import type { ClipId } from '@/features/clips/types';
import type { CollectionId } from '@/features/collections/types';
import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';

export interface ActionsGroupMenuItem {
  disabled?: boolean;
  hidden?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  separator?: boolean;
  variant?: 'default' | 'destructive';
}

export interface PrimaryAction {
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export interface ActionsGroupProps {
  disabled?: boolean;
  menuItems: ActionsGroupMenuItem[];
  primaryAction?: PrimaryAction;
}

type ContentId = TalkId | ClipId | CollectionId | SpeakerId | TopicId;
type ContentType = 'talk' | 'clip' | 'collection' | 'speaker' | 'topic';

export interface ContentActionsGroupProps {
  additionalActions?: ActionsGroupMenuItem[];
  content: {
    _id: ContentId;
    status?: StatusType;
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
}
