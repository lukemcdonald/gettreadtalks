'use client';

import type { ComponentPropsWithoutRef, FormEvent } from 'react';

import { useId, useState } from 'react';
import { CircleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Field,
  FieldLabel,
  Fieldset,
  Form,
  Input,
  PasswordInput,
} from '@/components/ui';
import { signUp } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException } from '@/services/errors/client';

export function RegisterForm(props: ComponentPropsWithoutRef<'form'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';

  const [name, setName] = useState('');
  const nameId = useId();
  const [email, setEmail] = useState('');
  const emailId = useId();
  const [password, setPassword] = useState('');
  const passwordId = useId();

  const isDisabled = isLoading || !email || !password;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await signUp({ email, name, password });

      if (data) {
        // Use window.location.href to force full page reload and set JWT cookie
        window.location.href = redirectTo;
      } else {
        setError(signUpError?.message ?? AUTH_ERRORS.REGISTRATION_FAILED);
      }
    } catch (err) {
      captureException(err, { fingerprint: ['auth', 'signUp'] });
      setError(AUTH_ERRORS.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="gap-6" onSubmit={handleSubmit} {...props}>
      {!!error && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Fieldset className="max-w-full" disabled={isLoading}>
        <Field>
          <FieldLabel htmlFor={nameId}>Name</FieldLabel>
          <Input
            autoComplete="name"
            id={nameId}
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            size="lg"
            type="text"
            value={name}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={emailId}>
            Email address <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            autoComplete="email"
            id={emailId}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            size="lg"
            type="email"
            value={email}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={passwordId}>
            Password <span className="text-destructive">*</span>
          </FieldLabel>
          <PasswordInput
            autoComplete="new-password"
            id={passwordId}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            value={password}
          />
        </Field>

        <div className="mt-4 flex flex-col gap-3">
          <Button disabled={isDisabled} type="submit">
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
