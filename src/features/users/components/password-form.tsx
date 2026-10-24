'use client';

import type { PasswordFormData } from '@/features/users/schemas/password-form';
import type { Control, UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Button, Fieldset, PasswordField } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateUserPassword } from '@/features/users/actions/update-password';
import { NewPasswordFields } from '@/features/users/components/auth-form';
import { passwordFormSchema } from '@/features/users/schemas/password-form';

function usePasswordsMatch(control: Control<PasswordFormData>) {
  const confirmPassword = useWatch({ control, name: 'confirmPassword' });
  const newPassword = useWatch({ control, name: 'newPassword' });

  return newPassword.length > 0 && newPassword === confirmPassword;
}

async function submitPasswordUpdate(
  form: UseFormReturn<PasswordFormData>,
  values: PasswordFormData
) {
  try {
    await updateUserPassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    toastManager.add({
      description: 'Your password has been changed. You are still logged in.',
      title: 'Password updated',
      type: 'success',
    });
    form.reset();
  } catch {
    toastManager.add({
      description: 'Check that your current password is correct and try again.',
      title: 'Failed to update password',
      type: 'error',
    });
  }
}

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<PasswordFormData>({
    defaultValues: {
      confirmPassword: '',
      currentPassword: '',
      newPassword: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(passwordFormSchema),
  });
  const passwordsMatch = usePasswordsMatch(form.control);

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          await submitPasswordUpdate(form, values);
        });
      })}
    >
      <Fieldset disabled={isPending}>
        <NewPasswordFields control={form.control} />
        {passwordsMatch && (
          <PasswordField
            control={form.control}
            label="Current password"
            name="currentPassword"
            required
          />
        )}
      </Fieldset>
      {passwordsMatch && (
        <div className="mt-4">
          <Button loading={isPending} size="sm" type="submit">
            Update password
          </Button>
        </div>
      )}
    </form>
  );
}
