import { capitalize } from '@/utils';

export type StatusPrefill = 'archived';

export function parseStatusPrefill(
  value?: string | string[]
): StatusPrefill | undefined {
  const status = Array.isArray(value) ? value[0] : value;

  if (status === 'archived') {
    return status;
  }

  return undefined;
}

export function getUnsavedStatusPrefill(
  savedStatus: string | undefined,
  statusPrefill?: StatusPrefill
) {
  if (statusPrefill === undefined || statusPrefill === savedStatus) {
    return;
  }

  return statusPrefill;
}

export function formatUnsavedStatusNotice(status: StatusPrefill) {
  return `Status was pre-filled as ${capitalize(status)} and is not saved until you press Save.`;
}
