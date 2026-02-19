'use client';

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
  const form = useForm<ResetPasswordData>({
    defaultValues: { confirmPassword: '', newPassword: '' },
    mode: 'onTouched',
    resolver: zodResolver(resetPasswordSchema),
  });

  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: ResetPasswordData) {
    const { error: submitError } = await resetPassword({ newPassword: values.newPassword, token });

    if (submitError) {
      form.setError('root', { message: submitError.message ?? AUTH_ERRORS.RESET_TOKEN_INVALID });
    } else {
      window.location.href = '/login';
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      {!!errors.root && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <Fieldset className="max-w-full" disabled={isSubmitting}>
        <PasswordField control={form.control} label="New password" name="newPassword" required />
        <PasswordField
          control={form.control}
          label="Confirm new password"
          name="confirmPassword"
          required
        />
      </Fieldset>

      <Button disabled={isSubmitting} type="submit">
        Reset password
      </Button>
    </form>
  );
}
