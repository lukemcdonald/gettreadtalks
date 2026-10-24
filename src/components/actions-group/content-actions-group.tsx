'use client';

import type { ContentActionsGroupProps } from './actions-group.types';

import { ActionsGroup } from './actions-group';
import { ContentDeleteDialog } from './content-delete-dialog';
import { useContentActions } from './use-content-actions';

const EMPTY_ADDITIONAL_ACTIONS: ContentActionsGroupProps['additionalActions'] =
  [];

export function ContentActionsGroup({
  additionalActions = EMPTY_ADDITIONAL_ACTIONS,
  content,
  contentType,
  disabled,
  listUrl,
  onArchiveAction,
  onDeleteAction,
  primaryAction,
  viewUrl,
}: ContentActionsGroupProps) {
  const {
    deleteDialogOpen,
    handleDelete,
    isDeleting,
    isDisabled,
    menuItems,
    setDeleteDialogOpen,
  } = useContentActions({
    additionalActions,
    content,
    contentType,
    disabled,
    listUrl,
    onArchiveAction,
    onDeleteAction,
    viewUrl,
  });

  return (
    <>
      <ActionsGroup
        disabled={isDisabled}
        menuItems={menuItems}
        primaryAction={primaryAction}
      />
      {!!onDeleteAction && (
        <ContentDeleteDialog
          contentTitle={content.title}
          contentType={contentType}
          isDeleting={isDeleting}
          onDelete={handleDelete}
          onOpenChange={setDeleteDialogOpen}
          open={deleteDialogOpen}
        />
      )}
    </>
  );
}
