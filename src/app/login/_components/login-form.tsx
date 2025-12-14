'use client';

import { useId, useState } from 'react';
import { CircleAlertIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

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
} from '@/components/ui';
import { signIn, signUp } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException } from '@/services/errors/client';

type AuthIntent = 'signIn' | 'signUp';

export function LoginForm(props: React.ComponentPropsWithoutRef<'form'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const redirectTo = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState(initialEmail);
  const emailId = useId();
  const [password, setPassword] = useState('');
  const passwordId = useId();

  const isDisabled = isLoading || !email || !password;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const intent = (formData.get('intent') as AuthIntent) || 'signIn';

    setError('');
    setIsLoading(true);

    try {
      const submitAction = intent === 'signIn' ? signIn : signUp;
      const { data: submitData, error: submitError } = await submitAction({ email, password });

      if (submitData) {
        // Use window.location.href to force full page reload and set JWT cookie
        window.location.href = redirectTo;
      } else {
        const errorMessages = {
          signIn: AUTH_ERRORS.INVALID_CREDENTIALS,
          signUp: AUTH_ERRORS.REGISTRATION_FAILED,
        };
        setError(submitError?.message ?? errorMessages[intent]);
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
      {error && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Fieldset disabled={isLoading}>
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
            type="email"
            value={email}
          />
          <FieldError />
        </Field>

        <Field>
          <FieldLabel htmlFor={passwordId}>
            Password <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            autoComplete="current-password"
            id={passwordId}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            value={password}
          />
          <FieldError />
        </Field>

        <div className="mt-4 flex gap-4">
          <Button disabled={isDisabled} fullWidth name="intent" type="submit" value="signIn">
            'Sign In'
          </Button>
          <Button
            disabled={isDisabled}
            fullWidth
            name="intent"
            type="submit"
            value="signUp"
            variant="outline"
          >
            'Create Account'
          </Button>
        </div>
      </Fieldset>
    </Form>
  );
}
