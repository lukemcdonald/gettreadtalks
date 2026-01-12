'use client';

import type { StatusType } from '@/lib/types';

import { useState } from 'react';

type UseEntityStatusReturn = {
  /**
   * Check if entity is approved.
   */
  isApproved: boolean;
  /**
   * Check if entity is archived.
   */
  isArchived: boolean;
  /**
   * Check if entity is in backlog.
   */
  isBacklog: boolean;
  /**
   * Check if entity is published.
   */
  isPublished: boolean;
  /**
   * Set the entity status.
   */
  setStatus: (status: StatusType) => void;
  /**
   * Current entity status value.
   */
  status: StatusType;
};

/**
 * Hook to manage entity status (talks, clips, etc.) with helper functions.
 * Similar to query hooks that return `{ data, isLoading, isIdle }`.
 *
 * @param initialStatus - Initial status value
 * @returns Entity status state and helper functions
 *
 * @example
 * ```tsx
 * const { status, setStatus, isArchived, isPublished } = useEntityStatus('backlog');
 *
 * // Set status
 * setStatus('published');
 *
 * // Check status
 * if (isArchived) {
 *   return <div>This is archived</div>;
 * }
 * ```
 */
export function useEntityStatus(initialStatus: StatusType = 'backlog'): UseEntityStatusReturn {
  const [status, setStatus] = useState<StatusType>(initialStatus);

  return {
    isApproved: status === 'approved',
    isArchived: status === 'archived',
    isBacklog: status === 'backlog',
    isPublished: status === 'published',
    setStatus,
    status,
  };
}
