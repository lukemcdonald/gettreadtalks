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
