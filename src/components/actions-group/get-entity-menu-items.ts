import type { ActionsGroupMenuItem } from './actions-group.types';

import { getContentMenuItems } from './get-content-menu-items';

export function getEntityMenuItems({
  onDelete,
  viewUrl,
}: {
  onDelete: () => void;
  viewUrl?: string;
}): ActionsGroupMenuItem[] {
  return getContentMenuItems({ onDelete, viewUrl });
}
