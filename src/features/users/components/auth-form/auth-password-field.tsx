'use client';

import type { ReactNode } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import {
  Field,
  FieldError as FieldErrorMessage,
  FieldLabel,
  PasswordInput,
} from '@/components/ui';

interface AuthPasswordFieldProps {
  autoComplete: string;
  children?: ReactNode;
  error?: FieldError;
  register: UseFormRegisterReturn;
}

export function AuthPasswordField({
  autoComplete,
  children,
  error,
  register,
}: AuthPasswordFieldProps) {
  return (
    <Field invalid={!!error}>
      <FieldLabel>
        Password <span className="text-destructive">*</span>
      </FieldLabel>
      <PasswordInput autoComplete={autoComplete} {...register} />
      {!!error && <FieldErrorMessage match>{error.message}</FieldErrorMessage>}
      {children}
    </Field>
  );
}
