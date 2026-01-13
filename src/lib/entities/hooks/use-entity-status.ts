'use client';

import type { StatusType } from '@/lib/entities/types';

import { useState } from 'react';

/**
 * Hook to manage entity status (talks, clips, etc.) with helper functions.
 *
 * @param initialStatus - Initial status value
 * @returns Entity status state and helper functions
 */
export function useEntityStatus(initialStatus: StatusType = 'backlog') {
  const [status, setStatus] = useState(initialStatus);

  return {
    isApproved: status === 'approved',
    isArchived: status === 'archived',
    isBacklog: status === 'backlog',
    isPublished: status === 'published',
    setStatus,
    status,
  };
}
