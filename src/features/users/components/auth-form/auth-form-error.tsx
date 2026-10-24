'use client';

import type { FieldErrors, FieldValues } from 'react-hook-form';

import { CircleAlertIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui';

interface AuthFormErrorProps {
  error?: FieldErrors<FieldValues>['root'];
}

export function AuthFormError({ error }: AuthFormErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <Alert variant="error">
      <CircleAlertIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
