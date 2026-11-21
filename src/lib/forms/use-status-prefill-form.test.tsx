import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { getUnsavedStatusPrefill } from '@/lib/entities/status-prefill';
import { describe, expect, it, renderHook } from '@/test';

import { useStatusPrefillForm } from './use-status-prefill-form';

function useHarness(savedStatus: string, statusPrefill?: StatusPrefill) {
  const savedValues = { status: savedStatus, title: 'The Cross' };
  const unsavedStatus = getUnsavedStatusPrefill(savedStatus, statusPrefill);
  const displayedValues = {
    ...savedValues,
    status: unsavedStatus ?? savedStatus,
  };

  return useStatusPrefillForm(savedValues, displayedValues, unsavedStatus, {});
}

describe('useStatusPrefillForm', () => {
  it('shows a different status pre-fill as an unsaved change', () => {
    const { result } = renderHook(() => useHarness('published', 'archived'));

    expect(result.current.getValues('status')).toBe('archived');
    expect(result.current.formState.defaultValues?.status).toBe('published');
    expect(result.current.formState.isDirty).toBe(true);
    expect(result.current.formState.dirtyFields.status).toBe(true);
  });

  it('stays clean when the saved status already matches the pre-fill', () => {
    const { result } = renderHook(() => useHarness('archived', 'archived'));

    expect(result.current.getValues('status')).toBe('archived');
    expect(result.current.formState.isDirty).toBe(false);
  });

  it('stays clean without a pre-fill', () => {
    const { result } = renderHook(() => useHarness('published'));

    expect(result.current.getValues('status')).toBe('published');
    expect(result.current.formState.isDirty).toBe(false);
  });
});
