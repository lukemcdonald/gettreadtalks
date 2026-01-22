import type { EntityIdMap, SheetAction, SheetEntity } from './types';

export function buildSheetParam<E extends SheetEntity>(entity: E, action: 'new'): string;
export function buildSheetParam<E extends SheetEntity>(
  entity: E,
  action: 'edit',
  id: EntityIdMap[E],
): string;
export function buildSheetParam<E extends SheetEntity>(
  entity: E,
  action: SheetAction,
  id?: EntityIdMap[E],
): string {
  if (action === 'edit') {
    return `${entity}:${action}:${id}`;
  }
  return `${entity}:${action}`;
}
