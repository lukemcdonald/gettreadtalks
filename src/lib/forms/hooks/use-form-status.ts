'use client';

import type { FormStatus } from '../types';

import { useState } from 'react';

/**
 * Hook to manage form operation status with helper functions.
 * Similar to query hooks that return `{ data, isLoading, isIdle }`.
 *
 * @returns Form status state and helper functions
 *
 * @example
 * ```tsx
 * const { status, setStatus, isBusy, isCreating, isUpdating } = useFormStatus();
 *
 * // Set status
 * setStatus('creating');
 *
 * // Check status
 * if (isCreating) {
 *   return <div>Creating...</div>;
 * }
 * ```
 */
export function useFormStatus() {
  const [status, setStatus] = useState<FormStatus>('idle');

  const isBusy = status !== 'idle';
  const isDestructive = status === 'archiving' || status === 'unarchiving' || status === 'deleting';

  return {
    // Check if form is archiving a record.
    isArchiving: status === 'archiving',
    // Check if form is currently performing any operation.
    isBusy,
    // Check if form is creating a new record.
    isCreating: status === 'creating',
    // Check if form is deleting a record.
    isDeleting: status === 'deleting',
    // Check if form is performing any destructive operation.
    isDestructive,
    // Check if form is idle (not performing any operation).
    isIdle: status === 'idle',
    // Check if form is unarchiving a record.
    isUnarchiving: status === 'unarchiving',
    // Check if form is updating an existing record.
    isUpdating: status === 'updating',
    // Set the form operation status.
    setStatus,
    // Current form operation status value.
    status,
  };
}
