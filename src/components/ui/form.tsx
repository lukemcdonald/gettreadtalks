'use client';

import type { ComponentPropsWithoutRef } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { FormProvider } from 'react-hook-form';

import { cn } from '@/utils';

type FormProps<T extends FieldValues = FieldValues> = ComponentPropsWithoutRef<'form'> & {
  /**
   * Optional React Hook Form instance. When provided, wraps children with FormProvider.
   * All forms should use React Hook Form, so this is the recommended pattern.
   *
   * @example
   * ```tsx
   * const form = useForm({ ... });
   * <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
   *   {/* form fields *\/}
   * </Form>
   * ```
   */
  form?: UseFormReturn<T>;
};

function Form<T extends FieldValues = FieldValues>({
  className,
  form,
  noValidate = true,
  ...props
}: FormProps<T>) {
  const formElement = (
    <form
      className={cn('flex w-full flex-col gap-4', className)}
      data-slot="form"
      noValidate={noValidate}
      {...props}
    />
  );

  if (form) {
    return <FormProvider {...form}>{formElement}</FormProvider>;
  }

  return formElement;
}

export { Form };
