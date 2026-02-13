'use client';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Button, Fieldset, PasswordField } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateUserPassword } from '@/features/users/actions/update-password';
import { type PasswordFormData, passwordFormSchema } from '@/features/users/schemas/password-form';

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<PasswordFormData>({
    defaultValues: { confirmPassword: '', currentPassword: '', newPassword: '' },
    mode: 'onTouched',
    resolver: zodResolver(passwordFormSchema),
  });

  const newPassword = useWatch({ control: form.control, name: 'newPassword' });
  const confirmPassword = useWatch({ control: form.control, name: 'confirmPassword' });
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  function onSubmit(values: PasswordFormData) {
    startTransition(async () => {
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
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Fieldset className="max-w-full" disabled={isPending}>
        <PasswordField control={form.control} label="New password" name="newPassword" required />
        <PasswordField
          control={form.control}
          label="Confirm new password"
          name="confirmPassword"
          required
        />
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
          <Button disabled={isPending} size="sm" type="submit">
            Update password
          </Button>
        </div>
      )}
    </form>
  );
}
