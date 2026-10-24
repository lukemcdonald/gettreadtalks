'use client';

import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import {
  Field,
  FieldError as FieldErrorMessage,
  FieldLabel,
  Input,
} from '@/components/ui';

interface AuthEmailFieldProps {
  error?: FieldError;
  register: UseFormRegisterReturn;
}

export function AuthEmailField({ error, register }: AuthEmailFieldProps) {
  return (
    <Field invalid={!!error}>
      <FieldLabel>
        Email address <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        autoComplete="email"
        placeholder="name@example.com"
        size="lg"
        type="email"
        {...register}
      />
      {!!error && <FieldErrorMessage match>{error.message}</FieldErrorMessage>}
    </Field>
  );
}
