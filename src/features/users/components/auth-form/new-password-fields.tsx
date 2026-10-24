'use client';

import type { Control, FieldValues, Path } from 'react-hook-form';

import { PasswordField } from '@/components/ui';

interface NewPasswordFieldsProps<T extends FieldValues> {
  control: Control<T>;
}

export function NewPasswordFields<
  T extends FieldValues & {
    confirmPassword: string;
    newPassword: string;
  },
>({ control }: NewPasswordFieldsProps<T>) {
  return (
    <>
      <PasswordField
        control={control}
        label="New password"
        name={'newPassword' as Path<T>}
        required
      />
      <PasswordField
        control={control}
        label="Confirm new password"
        name={'confirmPassword' as Path<T>}
        required
      />
    </>
  );
}
