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

export type ActionsGroupProps = {
  disabled?: boolean;
  menuItems: ActionsGroupMenuItem[];
  // TODO: Should this infer types from HTMLButtonElement and HTMLAnchorElement
  primaryAction?: {
    disabled?: boolean;
    href?: string;
    icon?: ReactNode;
    label: string;
    loading?: boolean;
    loadingLabel?: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
  };
};

// TODO: Is there a better way to do with more dynamically?
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
  // TODO: Dry this up with ActionsGroupProps primaryAction. Should be similar.
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    loading?: boolean;
    loadingLabel?: string;
    type?: 'button' | 'submit';
  };
  viewUrl?: string;
};
