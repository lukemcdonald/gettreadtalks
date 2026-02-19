'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle, Button, Fieldset, TextField } from '@/components/ui';
import { requestPasswordReset } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<ForgotPasswordData>({
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordData) {
    setError('');

    const { error: submitError } = await requestPasswordReset({ email: values.email });

    if (submitError) {
      setError(submitError.message ?? AUTH_ERRORS.RESET_EMAIL_FAILED);
    } else {
      setSucceeded(true);
    }
  }

  if (succeeded) {
    return (
      <div className="space-y-4">
        <p className="text-sm">
          If an account exists for that email, we've sent a password reset link. Check your inbox.
        </p>
        <Link className="text-muted-foreground text-sm hover:underline" href="/login">
          Back to login
        </Link>
      </div>
    );
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
        <TextField
          control={form.control}
          label="Email address"
          name="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </Fieldset>

      <div className="flex items-center gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          Send reset link
        </Button>
        <Link className="text-muted-foreground text-sm hover:underline" href="/login">
          Back to login
        </Link>
      </div>
    </form>
  );
}
