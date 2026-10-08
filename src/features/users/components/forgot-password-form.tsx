'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlertIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Fieldset,
  TextField,
} from '@/components/ui';
import { Link } from '@/components/ui/link';
import {
  resetCaptchaIfNeeded,
  TurnstileField,
} from '@/features/users/components/turnstile-field';
import { requestPasswordReset } from '@/services/auth/client';
import {
  AUTH_ERRORS,
  hasCaptchaToken,
  isTurnstileRequired,
} from '@/services/auth/config';
import { captureException } from '@/services/errors';

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const captchaRequired = isTurnstileRequired();
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [captchaToken, setCaptchaToken] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const form = useForm<ForgotPasswordData>({
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    if (!captchaToken) {
      return;
    }

    form.clearErrors('root');
  }, [captchaToken, form]);

  async function onSubmit(values: ForgotPasswordData) {
    if (!hasCaptchaToken(captchaRequired, captchaToken)) {
      form.setError('root', { message: AUTH_ERRORS.CAPTCHA_REQUIRED });
      return;
    }

    const result = await requestPasswordReset({
      captchaToken,
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

    resetCaptchaIfNeeded(captchaRequired, setCaptchaResetKey, setCaptchaToken);
    form.setError('root', {
      message: result.error.message ?? AUTH_ERRORS.RESET_EMAIL_FAILED,
    });
  }

  if (succeeded) {
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

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      {!!errors.root && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <Fieldset disabled={isSubmitting}>
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
      </Fieldset>

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
    </form>
  );
}
