'use client';

import type { ComponentPropsWithoutRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Field,
  FieldError,
  FieldLabel,
  Fieldset,
  Form,
  Input,
  PasswordInput,
} from '@/components/ui';
import { useAnalytics } from '@/lib/analytics';
import { signIn } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException } from '@/services/errors/client';

const loginFormSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export function LoginForm(props: ComponentPropsWithoutRef<'form'>) {
  const { track } = useAnalytics();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: searchParams.get('email') || '',
      password: '',
    },
    resolver: zodResolver(loginFormSchema),
  });

  const { errors, isSubmitting } = form.formState;

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    try {
      const { data, error: signInError } = await signIn({ email, password });

      if (data) {
        track('signed_in');
        // Use window.location.href to force full page reload and set JWT cookie
        window.location.href = redirectTo;
      } else {
        form.setError('root', { message: signInError?.message ?? AUTH_ERRORS.INVALID_CREDENTIALS });
      }
    } catch (err) {
      captureException(err, { fingerprint: ['auth', 'signIn'] });
      form.setError('root', { message: AUTH_ERRORS.NETWORK_ERROR });
    }
  });

  return (
    <Form className="gap-6" onSubmit={handleSubmit} {...props}>
      {!!errors.root && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <Fieldset className="max-w-full" disabled={isSubmitting}>
        <Field invalid={!!errors.email}>
          <FieldLabel>
            Email address <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            autoComplete="email"
            placeholder="name@example.com"
            size="lg"
            type="email"
            {...form.register('email')}
          />
          {!!errors.email && <FieldError match>{errors.email.message}</FieldError>}
        </Field>

        <Field invalid={!!errors.password}>
          <FieldLabel>
            Password <span className="text-destructive">*</span>
          </FieldLabel>
          <PasswordInput autoComplete="current-password" {...form.register('password')} />
          {!!errors.password && <FieldError match>{errors.password.message}</FieldError>}
          <div className="flex justify-end">
            <Link className="text-muted-foreground text-sm hover:underline" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </Field>

        <div className="mt-4 flex flex-col gap-3">
          <Button disabled={isSubmitting} type="submit">
            Sign In
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            Don't have an account?{' '}
            <Link className="text-foreground hover:underline" href="/register">
              Create one
            </Link>
          </p>
        </div>
      </Fieldset>
    </Form>
  );
}
