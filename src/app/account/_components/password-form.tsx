'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Fieldset, FormError, TextField } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updatePassword } from '@/features/users/actions/update-password';

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

  function onSubmit(values: PasswordFormValues) {
    if (values.newPassword !== values.confirmPassword) {
      form.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    startTransition(async () => {
      try {
        await updatePassword({
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
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <FormError error={form.formState.errors.root} />
      <Fieldset disabled={isPending}>
        <TextField
          control={form.control}
          label="Current Password"
          name="currentPassword"
          required
          type="password"
        />
        <TextField
          control={form.control}
          label="New Password"
          name="newPassword"
          required
          type="password"
        />
        <TextField
          control={form.control}
          label="Confirm New Password"
          name="confirmPassword"
          required
          type="password"
        />
      </Fieldset>
      <div>
        <Button disabled={isPending} size="sm" type="submit">
          Update Password
        </Button>
      </div>
    </form>
  );
}
