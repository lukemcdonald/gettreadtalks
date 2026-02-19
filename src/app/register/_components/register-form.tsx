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
import { signUp } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException } from '@/services/errors/client';

const registerFormSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Please enter a valid email.'),
  name: z.string().optional(),
  password: z.string().min(8, 'Must be at least eight characters long.'),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export function RegisterForm(props: ComponentPropsWithoutRef<'form'>) {
  const { track } = useAnalytics();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';

  const form = useForm<RegisterFormData>({
    defaultValues: { email: '', name: '', password: '' },
    resolver: zodResolver(registerFormSchema),
  });

  const { errors, isSubmitting } = form.formState;

  const handleSubmit = form.handleSubmit(async ({ email, name, password }) => {
    try {
      const { data, error: signUpError } = await signUp({ email, name, password });

      if (data) {
        track('signed_up');
        // Use window.location.href to force full page reload and set JWT cookie
        window.location.href = redirectTo;
      } else {
        form.setError('root', { message: signUpError?.message ?? AUTH_ERRORS.REGISTRATION_FAILED });
      }
    } catch (err) {
      captureException(err, { fingerprint: ['auth', 'signUp'] });
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
          <PasswordInput autoComplete="new-password" {...form.register('password')} />
          {!!errors.password && <FieldError match>{errors.password.message}</FieldError>}
        </Field>

        <div className="mt-4 flex flex-col gap-3">
          <Button disabled={isSubmitting} type="submit">
            Create Account
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link className="text-foreground hover:underline" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </Fieldset>
    </Form>
  );
}
