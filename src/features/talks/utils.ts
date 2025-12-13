import type { StatusType } from '@/convex/lib/validators/shared';
import type { FormStatus } from '@/lib/forms/types';

/**
 * Generate a talk URL with speaker and talk slugs.
 * @param speakerSlug - Speaker slug identifier
 * @param talkSlug - Talk slug identifier
 * @returns URL path for the talk
 */
export function getTalkUrl(speakerSlug: string, talkSlug: string): string {
  return `/talks/${speakerSlug}/${talkSlug}`;
}

/**
 * Get submit button label based on form operation status.
 */
export function getSubmitButtonLabel(status: FormStatus, talkId?: string): string {
  if (status === 'creating') {
    return 'Creating...';
  }

  if (status === 'updating') {
    return 'Updating...';
  }

  if (talkId) {
    return 'Update Talk';
  }

  return 'Create Talk';
}

/**
 * Get archive button label based on form operation status and talk status.
 */
export function getArchiveButtonLabel(status: FormStatus, talkStatus: StatusType): string {
  if (status === 'archiving') {
    return 'Archiving...';
  }

  if (status === 'unarchiving') {
    return 'Unarchiving...';
  }

  return talkStatus === 'archived' ? 'Unarchive Talk' : 'Archive Talk';
}

