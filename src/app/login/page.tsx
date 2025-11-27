'use client';

import { useId, useState } from 'react';

import { PageLayout } from '@/components/page-layout';
import { signIn, signUp } from '@/services/auth/client';
import { AUTH_ERRORS } from '@/services/auth/config';
import { captureException } from '@/services/errors/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn({ email, password });

      if (result.data) {
        // Use window.location.href to force full page reload and set JWT cookie
        window.location.href = '/account';
      } else {
        setError(result.error?.message || AUTH_ERRORS.INVALID_CREDENTIALS);
      }
    } catch (err) {
      captureException(err, {
        fingerprint: ['auth', 'signIn'],
      });
      setError(AUTH_ERRORS.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signUp({ email, password });

      if (result.data) {
        // Use window.location.href to force full page reload and set JWT cookie
        window.location.href = '/account';
      } else {
        setError(result.error?.message || AUTH_ERRORS.REGISTRATION_FAILED);
      }
    } catch (err) {
      captureException(err, {
        fingerprint: ['auth', 'signUp'],
      });
      setError(AUTH_ERRORS.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageLayout.Content>
        <div className="m-auto w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center font-bold text-3xl text-foreground">Welcome Back</h2>
            <p className="mt-2 text-center text-muted-foreground text-sm">
              Sign in to your account or create a new one
            </p>
          </div>
          <form className="mt-8 space-y-6">
            {error && (
              <div className="rounded border border-destructive/32 bg-destructive/8 px-4 py-3 text-destructive-foreground">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-foreground text-sm" htmlFor="email">
                  Email address
                </label>
                <input
                  autoComplete="email"
                  className="relative mt-1 block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                  id={useId()}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground text-sm" htmlFor="password">
                  Password
                </label>
                <input
                  autoComplete="current-password"
                  className="relative mt-1 block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                  id={useId()}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 font-semibold text-primary-foreground text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading || !email || !password}
                onClick={handleLogin}
                type="button"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              <button
                className="group relative flex w-full justify-center rounded-md border border-border bg-background px-4 py-2 font-semibold text-foreground text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading || !email || !password}
                onClick={handleRegister}
                type="button"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
