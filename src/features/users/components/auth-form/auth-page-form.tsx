'use client';

import type { FormEventHandler, ReactNode } from 'react';
import type { FieldErrors, FieldValues } from 'react-hook-form';

import { Fieldset } from '@/components/ui';

import { AuthFormError } from './auth-form-error';

interface AuthPageFormProps {
  children: ReactNode;
  error?: FieldErrors<FieldValues>['root'];
  footer: ReactNode;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function AuthPageForm({
  children,
  error,
  footer,
  isSubmitting,
  onSubmit,
}: AuthPageFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <AuthFormError error={error} />
      <Fieldset disabled={isSubmitting}>{children}</Fieldset>
      {footer}
    </form>
  );
}
