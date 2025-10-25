'use client';

import { useId, useState } from 'react';

import { useRouter } from 'next/navigation';

import MainLayout from '@/components/layout/main-layout';
import { signIn, signUp } from '@/lib/services/auth/client';
import { AUTH_ERRORS } from '@/lib/services/auth/config';
import { captureException } from '@/lib/services/errors/client';

export default function LoginPage() {
  const router = useRouter();
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
        router.push('/account');
      } else {
        setError(result.error?.message || AUTH_ERRORS.INVALID_CREDENTIALS);
      }
    } catch (err) {
      captureException(err, {
        context: {
          operation: 'login',
          email,
        },
        fingerprint: ['auth', 'login', 'client-error'],
        level: 'error',
        tags: {
          feature: 'auth',
          operation: 'login',
        },
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
        router.push('/account');
      } else {
        setError(result.error?.message || AUTH_ERRORS.REGISTRATION_FAILED);
      }
    } catch (err) {
      captureException(err, {
        context: {
          operation: 'registration',
          email,
        },
        fingerprint: ['auth', 'registration', 'client-error'],
        level: 'error',
        tags: {
          feature: 'auth',
          operation: 'registration',
        },
      });
      setError(AUTH_ERRORS.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="m-auto max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account or create a new one
          </p>
        </div>
        <form className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id={useId()}
                autoComplete="email"
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                type="email"
                value={email}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id={useId()}
                autoComplete="current-password"
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !email || !password}
              onClick={handleLogin}
              type="button"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !email || !password}
              onClick={handleRegister}
              type="button"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
