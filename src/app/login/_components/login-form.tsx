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
import { signIn, signUp } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException } from '@/services/errors/client';

type AuthIntent = 'signIn' | 'signUp';

export function LoginForm(props: ComponentPropsWithoutRef<'form'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [intent, setIntent] = useState<AuthIntent | null>(null);

  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const redirectTo = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState(initialEmail);
  const emailId = useId();
  const [name, setName] = useState('');
  const nameId = useId();
  const [password, setPassword] = useState('');
  const passwordId = useId();

  const isSignUp = intent === 'signUp';
  const isDisabled = isLoading || !email || !password;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submittedIntent: AuthIntent = intent ?? 'signIn';

    setError('');
    setIsLoading(true);

    try {
      const submitAction = submittedIntent === 'signIn' ? signIn : signUp;
      const { data: submitData, error: submitError } = await submitAction({
        email,
        name,
        password,
      });

      if (submitData) {
        // Use window.location.href to force full page reload and set JWT cookie
        window.location.href = redirectTo;
      } else {
        const errorMessages = {
          signIn: AUTH_ERRORS.INVALID_CREDENTIALS,
          signUp: AUTH_ERRORS.REGISTRATION_FAILED,
        };
        setError(submitError?.message ?? errorMessages[submittedIntent]);
      }
    } catch (err) {
      captureException(err, { fingerprint: ['auth', intent] });
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
        {isSignUp && (
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
        )}

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
            autoComplete="current-password"
            id={passwordId}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            value={password}
          />
          <div className="flex justify-end">
            <Link className="text-muted-foreground text-sm hover:underline" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </Field>

        <div className="mt-4 flex gap-4">
          <Button
            className="flex-1"
            disabled={isDisabled}
            name="intent"
            type="submit"
            value="signIn"
          >
            Sign In
          </Button>
          <Button
            className="flex-1"
            disabled={isSignUp ? isDisabled : isLoading}
            name="intent"
            onClick={() => setIntent('signUp')}
            type={isSignUp ? 'submit' : 'button'}
            value="signUp"
            variant="outline"
          >
            Create Account
          </Button>
        </div>
      </Fieldset>
    </Form>
  );
}
