import type { ContentActionsGroupProps } from './actions-group.types';

import { toastManager } from '@/components/ui/primitives/toast';
import { formatErrorMessage } from '@/services/errors';
import { capitalize } from '@/utils';

type ContentId = ContentActionsGroupProps['content']['_id'];
interface ContentRouter {
  push: (url: string) => void;
  refresh: () => void;
}

export async function runContentArchive({
  contentId,
  contentType,
  isArchived,
  onArchiveAction,
  router,
  setIsArchiving,
}: {
  contentId: ContentId;
  contentType: string;
  isArchived: boolean;
  onArchiveAction?: ContentActionsGroupProps['onArchiveAction'];
  router: ContentRouter;
  setIsArchiving: (isArchiving: boolean) => void;
}) {
  if (!onArchiveAction) {
    return;
  }

  setIsArchiving(true);

  try {
    await onArchiveAction(contentId);
    toastManager.add({
      title: `${capitalize(contentType)} ${isArchived ? 'unarchived' : 'archived'}`,
      type: 'success',
    });
    router.refresh();
  } catch (error: unknown) {
    toastManager.add({
      description: formatErrorMessage(error),
      title: `Failed to archive ${contentType}`,
      type: 'error',
    });
  }

  setIsArchiving(false);
}

export async function runContentDelete({
  contentId,
  contentType,
  listUrl,
  onDeleteAction,
  router,
  setDeleteDialogOpen,
  setIsDeleting,
}: {
  contentId: ContentId;
  contentType: string;
  listUrl?: string;
  onDeleteAction?: ContentActionsGroupProps['onDeleteAction'];
  router: ContentRouter;
  setDeleteDialogOpen: (open: boolean) => void;
  setIsDeleting: (isDeleting: boolean) => void;
}) {
  if (!onDeleteAction) {
    return;
  }

  setIsDeleting(true);

  try {
    await onDeleteAction(contentId);
    toastManager.add({
      title: `${capitalize(contentType)} deleted`,
      type: 'success',
    });
    setDeleteDialogOpen(false);

    if (listUrl) {
      router.push(listUrl);
    } else {
      router.refresh();
    }
  } catch (error: unknown) {
    toastManager.add({
      description: formatErrorMessage(error),
      title: `Failed to delete ${contentType}`,
      type: 'error',
    });
  }

  setIsDeleting(false);
}
