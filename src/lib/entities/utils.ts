import type { StatusType } from './types';

/**
 * Get archive action label based on entity status and loading state.
 * Used across entity types for consistent archive/unarchive labeling.
 */
export function getArchiveLabel({
  isLoading,
  status,
}: {
  isLoading: boolean;
  status?: StatusType;
}): string {
  if (isLoading) {
    return 'Archiving...';
  }

  if (status === 'archived') {
    return 'Unarchive';
  }

  return 'Archive';
}
