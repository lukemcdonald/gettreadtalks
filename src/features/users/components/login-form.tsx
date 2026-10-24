'use client';

import type { ComponentPropsWithoutRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Link } from '@/components/ui/link';
import {
  AuthCardForm,
  AuthEmailField,
  AuthFormActions,
  AuthPasswordField,
} from '@/features/users/components/auth-form';
import { track, waitForAnalytics } from '@/services/analytics';
import { signIn } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException, toUserErrorMessage } from '@/services/errors';
import { getSafeRedirect } from '@/utils';

const loginFormSchema = z.object({
  email: z.email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

async function submitLogin(
  form: UseFormReturn<LoginFormData>,
  redirectTo: string,
  { email, password }: LoginFormData
) {
  try {
    const { data, error: signInError } = await signIn({ email, password });

    if (data) {
      await waitForAnalytics(track('signed_in'));
      // Use window.location.href to force full page reload and set JWT cookie
      window.location.assign(redirectTo);
    } else {
      form.setError('root', {
        message: toUserErrorMessage(
          signInError?.message,
          AUTH_ERRORS.INVALID_CREDENTIALS
        ),
      });
    }
  } catch (error) {
    captureException(error, { fingerprint: ['auth', 'signIn'] });
    form.setError('root', { message: AUTH_ERRORS.NETWORK_ERROR });
  }
}

export function LoginForm({ ...delegated }: ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: searchParams.get('email') || '',
      password: '',
    },
    resolver: zodResolver(loginFormSchema),
  });
  const { errors, isSubmitting } = form.formState;

  return (
    <AuthCardForm
      error={errors.root}
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit((values) =>
        submitLogin(form, redirectTo, values)
      )}
      {...delegated}
    >
      <AuthEmailField error={errors.email} register={form.register('email')} />
      <AuthPasswordField
        autoComplete="current-password"
        error={errors.password}
        register={form.register('password')}
      >
        <div className="flex justify-end">
          <Link
            className="text-muted-foreground text-sm hover:underline"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
      </AuthPasswordField>
      <AuthFormActions
        isSubmitting={isSubmitting}
        label="Sign In"
        testId="sign-in-submit"
      >
        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link className="text-foreground hover:underline" href="/register">
            Create one
          </Link>
        </p>
      </AuthFormActions>
    </AuthCardForm>
  );
}
