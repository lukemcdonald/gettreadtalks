import type { ReactNode } from 'react';
import type { ClipId } from '@/features/clips/types';
import type { CollectionId } from '@/features/collections/types';
import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId, TalkStatus } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';

export type ActionsGroupMenuItem = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  hidden?: boolean;
  separator?: boolean;
};

export type ActionsGroupProps = {
  primaryAction?: {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    type?: 'button' | 'submit';
  };
  menuItems: ActionsGroupMenuItem[];
  disabled?: boolean;
};

type ContentId = TalkId | ClipId | CollectionId | SpeakerId | TopicId;

export type ContentActionsGroupProps = {
  content: {
    _id: ContentId;
    status?: TalkStatus;
    title?: string;
  };
  contentType: 'talk' | 'clip' | 'collection' | 'speaker' | 'topic';
  editUrl?: string;
  viewUrl?: string;
  listUrl?: string;
  onArchiveAction?: (id: ContentId) => Promise<void>;
  onDeleteAction?: (id: ContentId) => Promise<void>;
  additionalActions?: ActionsGroupMenuItem[];
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    type?: 'button' | 'submit';
  };
};
