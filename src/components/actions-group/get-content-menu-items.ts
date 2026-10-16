import type { ActionsGroupMenuItem } from './actions-group.types';

export function getContentMenuItems({
  additionalActions = [],
  archive,
  onDelete,
  viewUrl,
}: {
  additionalActions?: ActionsGroupMenuItem[];
  archive?: {
    disabled?: boolean;
    label: string;
    onClick: () => void;
  };
  onDelete?: () => void;
  viewUrl?: string;
}): ActionsGroupMenuItem[] {
  const items: ActionsGroupMenuItem[] = [];

  if (viewUrl) {
    items.push({ href: viewUrl, label: 'View' });
  }

  if (archive) {
    items.push(archive);
  }

  items.push(...additionalActions);

  if (onDelete) {
    items.push({
      label: 'Delete',
      onClick: onDelete,
      separator: items.length > 0,
      variant: 'destructive',
    });
  }

  return items;
}
