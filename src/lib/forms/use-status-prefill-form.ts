'use client';

import type { StatusPrefill } from '@/lib/entities/status-prefill';
import type { DefaultValues, FieldValues, UseFormProps } from 'react-hook-form';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type StatusFormValues = FieldValues & {
  status: string;
};

type StatusPrefillFormOptions<T extends StatusFormValues> = Omit<
  UseFormProps<T>,
  'defaultValues' | 'resetOptions' | 'values'
>;

/**
 * Shows `displayedValues` immediately and, when the status was pre-filled,
 * keeps the saved entity as the dirty baseline until Save.
 */
export function useStatusPrefillForm<T extends StatusFormValues>(
  savedValues: T,
  displayedValues: T,
  unsavedStatus: StatusPrefill | undefined,
  options: StatusPrefillFormOptions<T>
) {
  const form = useForm<T>({
    ...options,
    defaultValues: displayedValues as DefaultValues<T>,
    resetOptions: unsavedStatus ? { keepDefaultValues: true } : undefined,
    values: displayedValues,
  });
  const { defaultValues } = form.formState;

  useEffect(() => {
    if (!unsavedStatus) {
      return;
    }

    if (defaultValues?.status === savedValues.status) {
      return;
    }

    form.resetDefaultValues(savedValues);
  }, [defaultValues, form, savedValues, unsavedStatus]);

  return form;
}
