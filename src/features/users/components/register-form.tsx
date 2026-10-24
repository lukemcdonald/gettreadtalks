'use client';

import type { ComponentPropsWithoutRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Field, FieldLabel, Input } from '@/components/ui';
import { Link } from '@/components/ui/link';
import {
  AuthCardForm,
  AuthEmailField,
  AuthFormActions,
  AuthPasswordField,
  requireCaptchaToken,
  useCaptchaField,
} from '@/features/users/components/auth-form';
import { TurnstileField } from '@/features/users/components/turnstile-field';
import { track, waitForAnalytics } from '@/services/analytics';
import { signUp } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException, toUserErrorMessage } from '@/services/errors';
import { getSafeRedirect } from '@/utils';

const registerFormSchema = z.object({
  email: z.email('Please enter a valid email.'),
  name: z.string().optional(),
  password: z.string().min(8, 'Must be at least eight characters long.'),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

async function submitRegister(
  captcha: ReturnType<typeof useCaptchaField>,
  form: UseFormReturn<RegisterFormData>,
  redirectTo: string,
  { email, name, password }: RegisterFormData
) {
  if (!requireCaptchaToken(form, captcha)) {
    return;
  }

  const result = await signUp({
    captchaToken: captcha.captchaToken,
    email,
    name,
    password,
  }).catch((error) => {
    captureException(error, { fingerprint: ['auth', 'signUp'] });
    return {
      data: null,
      error: { message: AUTH_ERRORS.NETWORK_ERROR },
    };
  });

  if (result.data) {
    await waitForAnalytics(track('signed_up'));
    window.location.assign(redirectTo);
    return;
  }

  captcha.resetCaptcha();
  form.setError('root', {
    message: toUserErrorMessage(
      result.error?.message,
      AUTH_ERRORS.REGISTRATION_FAILED
    ),
  });
}

export function RegisterForm({
  ...delegated
}: ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));
  const form = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    resolver: zodResolver(registerFormSchema),
  });
  const captcha = useCaptchaField(form);
  const { captchaResetKey, setCaptchaToken } = captcha;
  const { errors, isSubmitting } = form.formState;

  return (
    <AuthCardForm
      error={errors.root}
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit((values) =>
        submitRegister(captcha, form, redirectTo, values)
      )}
      {...delegated}
    >
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input
          autoComplete="name"
          placeholder="Your name"
          size="lg"
          type="text"
          {...form.register('name')}
        />
      </Field>
      <AuthEmailField error={errors.email} register={form.register('email')} />
      <AuthPasswordField
        autoComplete="new-password"
        error={errors.password}
        register={form.register('password')}
      />
      <TurnstileField
        onTokenChange={setCaptchaToken}
        resetKey={captchaResetKey}
      />
      <AuthFormActions isSubmitting={isSubmitting} label="Create Account">
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link className="text-foreground hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </AuthFormActions>
    </AuthCardForm>
  );
}
