'use client';

import type { ActionResult } from '@/lib/forms/types';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { useEffect, useTransition } from 'react';

import { setServerErrors } from '@/lib/forms/react-hook-form';

interface UseCreateFormSheetOptions<TFieldValues extends FieldValues, TResult> {
  form: UseFormReturn<TFieldValues>;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: TResult, values: TFieldValues) => void;
  open: boolean;
  submit: (values: TFieldValues) => Promise<ActionResult<TResult>>;
}

export function useCreateFormSheet<TFieldValues extends FieldValues, TResult>({
  form,
  onOpenChange,
  onSuccess,
  open,
  submit,
}: UseCreateFormSheetOptions<TFieldValues, TResult>) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await submit(values);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      onSuccess(result.data, values);
      onOpenChange(false);
    });
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);

  return {
    handleSubmit,
    isPending,
  };
}
