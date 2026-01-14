import type { StatusType } from '@/lib/entities/types';
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
export function getSubmitButtonLabel(formStatus: FormStatus, talkId?: string): string {
  if (formStatus === 'creating') {
    return 'Creating...';
  }

  if (formStatus === 'updating') {
    return 'Updating...';
  }

  if (talkId) {
    return 'Update Talk';
  }

  return 'Create Talk';
}
