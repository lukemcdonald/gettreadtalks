'use client';

import type { ParsedSheetParam, SheetAction, SheetEntity } from './types';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export { buildSheetParam } from './utils';

const SHEET_PARAM = 'sheet';
const VALID_ENTITIES = new Set<SheetEntity>(['talk', 'speaker', 'clip', 'collection', 'topic']);
const VALID_ACTIONS = new Set<SheetAction>(['new', 'edit']);

function parseSheetParam(param: string | null): ParsedSheetParam | null {
  if (!param) {
    return null;
  }

  const parts = param.split(':');
  if (parts.length < 2 || parts.length > 3) {
    return null;
  }

  const [entity, action, id] = parts;

  if (!VALID_ENTITIES.has(entity as SheetEntity)) {
    return null;
  }
  if (!VALID_ACTIONS.has(action as SheetAction)) {
    return null;
  }
  if (action === 'edit' && !id) {
    return null;
  }

  return {
    entity: entity as SheetEntity,
    action: action as SheetAction,
    id,
  };
}

export function useSheet() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sheetParamRaw = searchParams.get(SHEET_PARAM);
  const parsed = parseSheetParam(sheetParamRaw);

  function openSheet(param: string) {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(SHEET_PARAM, param);
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }

  function closeSheet() {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(SHEET_PARAM);
    const query = newParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return {
    sheetParam: parsed,
    sheetParamRaw,
    isOpen: parsed !== null,
    openSheet,
    closeSheet,
  };
}

export { parseSheetParam };
