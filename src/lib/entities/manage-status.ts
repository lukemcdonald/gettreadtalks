export const CONTENT_STATUS_OPTIONS = [
  { label: 'Published', value: 'published' },
  { label: 'Approved', value: 'approved' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Archived', value: 'archived' },
] as const;

export const PRESENCE_STATUS_OPTIONS = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
] as const;

export const STUDY_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
] as const;

const CONTENT_STATUS_VALUES = [
  'all',
  ...CONTENT_STATUS_OPTIONS.map((option) => option.value),
] as const;

const PRESENCE_STATUS_VALUES = [
  'all',
  ...PRESENCE_STATUS_OPTIONS.map((option) => option.value),
] as const;

type ContentStatusFilter = (typeof CONTENT_STATUS_VALUES)[number];
type PresenceStatusFilter = (typeof PRESENCE_STATUS_VALUES)[number];
type StudyStatusFilter = (typeof STUDY_STATUS_OPTIONS)[number]['value'];

export function parseContentStatus(status?: string): ContentStatusFilter {
  if (isListed(status, CONTENT_STATUS_VALUES)) {
    return status;
  }

  return 'published';
}

export function parsePresenceStatus(status?: string): PresenceStatusFilter {
  if (isListed(status, PRESENCE_STATUS_VALUES)) {
    return status;
  }

  return 'published';
}

export function parseStudyStatus(study?: string): StudyStatusFilter {
  if (study === 'published') {
    return 'published';
  }

  return 'draft';
}

export function hasManageListFilters({
  search,
  status,
}: {
  search?: string;
  status: string;
}) {
  if (search?.trim()) {
    return true;
  }

  return status !== 'all';
}

function isListed<T extends string>(
  status: string | undefined,
  values: readonly T[]
): status is T {
  if (!status) {
    return false;
  }

  return values.includes(status as T);
}
