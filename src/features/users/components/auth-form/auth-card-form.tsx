'use client';

import type {
  ComponentPropsWithoutRef,
  FormEventHandler,
  ReactNode,
} from 'react';
import type { FieldErrors, FieldValues } from 'react-hook-form';

import { Fieldset, Form } from '@/components/ui';

import { AuthFormError } from './auth-form-error';

interface AuthCardFormProps {
  children: ReactNode;
  error?: FieldErrors<FieldValues>['root'];
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function AuthCardForm({
  children,
  error,
  isSubmitting,
  onSubmit,
  ...delegated
}: AuthCardFormProps & ComponentPropsWithoutRef<'form'>) {
  return (
    <Form
      className="flex w-full flex-col gap-6"
      onSubmit={onSubmit}
      {...delegated}
    >
      <AuthFormError error={error} />
      <Fieldset disabled={isSubmitting}>{children}</Fieldset>
    </Form>
  );
}
