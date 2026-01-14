/**
 * Get archive action label based on loading and archived state.
 * Used across entity types for consistent archive/unarchive labeling.
 */
export function getArchiveLabel({
  isLoading,
  isArchived,
}: {
  isLoading: boolean;
  isArchived: boolean;
}): string {
  if (isLoading) {
    return 'Archiving...';
  }

  if (isArchived) {
    return 'Unarchive';
  }

  return 'Archive';
}
