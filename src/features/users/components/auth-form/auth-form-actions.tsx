'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui';

interface AuthFormActionsProps {
  children?: ReactNode;
  isSubmitting: boolean;
  label: string;
  testId?: string;
}

export function AuthFormActions({
  children,
  isSubmitting,
  label,
  testId,
}: AuthFormActionsProps) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <Button data-testid={testId} loading={isSubmitting} type="submit">
        {label}
      </Button>
      {children}
    </div>
  );
}
