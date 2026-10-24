'use client';

import type { UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui';
import {
  AuthPageForm,
  NewPasswordFields,
} from '@/features/users/components/auth-form';
import { resetPassword } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { toUserErrorMessage } from '@/services/errors';

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

async function submitResetPassword(
  form: UseFormReturn<ResetPasswordData>,
  token: string,
  values: ResetPasswordData
) {
  const { error: submitError } = await resetPassword({
    newPassword: values.newPassword,
    token,
  });

  if (submitError) {
    form.setError('root', {
      message: toUserErrorMessage(
        submitError.message,
        AUTH_ERRORS.RESET_TOKEN_INVALID
      ),
    });
  } else {
    window.location.assign('/login');
  }
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordData>({
    defaultValues: { confirmPassword: '', newPassword: '' },
    mode: 'onTouched',
    resolver: zodResolver(resetPasswordSchema),
  });
  const { errors, isSubmitting } = form.formState;

  return (
    <AuthPageForm
      error={errors.root}
      footer={
        <Button loading={isSubmitting} type="submit">
          Reset password
        </Button>
      }
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit((values) =>
        submitResetPassword(form, token, values)
      )}
    >
      <NewPasswordFields control={form.control} />
    </AuthPageForm>
  );
}
