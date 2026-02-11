'use client';

import { useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Button, Fieldset, FormError, TextField } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateUserPassword } from '@/features/users/actions/update-password';

interface PasswordFormValues {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<PasswordFormValues>({
    defaultValues: { confirmPassword: '', currentPassword: '', newPassword: '' },
  });

  const newPassword = useWatch({ control: form.control, name: 'newPassword' });
  const confirmPassword = useWatch({ control: form.control, name: 'confirmPassword' });
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  function onSubmit(values: PasswordFormValues) {
    startTransition(async () => {
      try {
        await updateUserPassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        toastManager.add({ title: 'Password updated', type: 'success' });
        form.reset();
      } catch {
        form.setError('root', {
          message: 'Failed to update password. Check your current password and try again.',
        });
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormError className="mb-3" error={form.formState.errors.root} />
      <Fieldset className="space-y-3" disabled={isPending}>
        <TextField
          control={form.control}
          label="New password"
          name="newPassword"
          required
          type="password"
        />
        <TextField
          control={form.control}
          label="Confirm new password"
          name="confirmPassword"
          required
          type="password"
        />
        {passwordsMatch && (
          <TextField
            control={form.control}
            label="Current password"
            name="currentPassword"
            required
            type="password"
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
