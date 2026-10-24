'use client';

import type { UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, TextField } from '@/components/ui';
import { Link } from '@/components/ui/link';
import {
  AuthPageForm,
  requireCaptchaToken,
  useCaptchaField,
} from '@/features/users/components/auth-form';
import { TurnstileField } from '@/features/users/components/turnstile-field';
import { requestPasswordReset } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException, toUserErrorMessage } from '@/services/errors';

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordSuccess() {
  return (
    <div className="space-y-4">
      <p className="text-sm">
        If an account exists for that email, we&apos;ve sent a password reset
        link. Check your inbox.
      </p>
      <Link
        className="text-muted-foreground text-sm hover:underline"
        href="/login"
      >
        Back to login
      </Link>
    </div>
  );
}

async function submitForgotPassword(
  captcha: ReturnType<typeof useCaptchaField>,
  form: UseFormReturn<ForgotPasswordData>,
  setSucceeded: (succeeded: boolean) => void,
  values: ForgotPasswordData
) {
  if (!requireCaptchaToken(form, captcha)) {
    return;
  }

  const result = await requestPasswordReset({
    captchaToken: captcha.captchaToken,
    email: values.email,
  }).catch((error) => {
    captureException(error, {
      fingerprint: ['auth', 'requestPasswordReset'],
    });
    return {
      error: { message: AUTH_ERRORS.NETWORK_ERROR },
    };
  });

  if (!result.error) {
    setSucceeded(true);
    return;
  }

  captcha.resetCaptcha();
  form.setError('root', {
    message: toUserErrorMessage(
      result.error.message,
      AUTH_ERRORS.RESET_EMAIL_FAILED
    ),
  });
}

export function ForgotPasswordForm() {
  const [succeeded, setSucceeded] = useState(false);
  const form = useForm<ForgotPasswordData>({
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(forgotPasswordSchema),
  });
  const captcha = useCaptchaField(form);
  const { captchaResetKey, setCaptchaToken } = captcha;
  const { errors, isSubmitting } = form.formState;

  if (succeeded) {
    return <ForgotPasswordSuccess />;
  }

  return (
    <AuthPageForm
      error={errors.root}
      footer={
        <div className="flex items-center gap-4">
          <Button loading={isSubmitting} type="submit">
            Send reset link
          </Button>
          <Link
            className="text-muted-foreground text-sm hover:underline"
            href="/login"
          >
            Back to login
          </Link>
        </div>
      }
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit((values) =>
        submitForgotPassword(captcha, form, setSucceeded, values)
      )}
    >
      <TextField
        control={form.control}
        label="Email address"
        name="email"
        placeholder="name@example.com"
        required
        type="email"
      />
      <TurnstileField
        onTokenChange={setCaptchaToken}
        resetKey={captchaResetKey}
      />
    </AuthPageForm>
  );
}
