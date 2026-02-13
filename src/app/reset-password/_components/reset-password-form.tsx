'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlertIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Fieldset,
  PasswordField,
} from '@/components/ui';
import { resetPassword } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';

const resetPasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    newPassword: z.string().min(8, 'Must be at least eight characters long.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = useState('');

  const form = useForm<ResetPasswordData>({
    defaultValues: { confirmPassword: '', newPassword: '' },
    mode: 'onTouched',
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetPasswordData) {
    setError('');

    const { error: submitError } = await resetPassword({ newPassword: values.newPassword, token });

    if (submitError) {
      setError(submitError.message ?? AUTH_ERRORS.RESET_TOKEN_INVALID);
    } else {
      window.location.href = '/login';
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      {!!error && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Fieldset className="max-w-full" disabled={form.formState.isSubmitting}>
        <PasswordField control={form.control} label="New password" name="newPassword" required />
        <PasswordField
          control={form.control}
          label="Confirm new password"
          name="confirmPassword"
          required
        />
      </Fieldset>

      <Button disabled={form.formState.isSubmitting} type="submit">
        Reset password
      </Button>
    </form>
  );
}
