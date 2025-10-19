'use client';

import { useState } from 'react';

import { addBreadcrumb, captureException } from '@/lib/services/errors';

export default function SentryTestPage() {
  const [lastError, setLastError] = useState<string>('');

  const testBasicError = () => {
    try {
      throw new Error('Test error from Sentry test page');
    } catch (error) {
      console.log('Capturing error with Sentry...', error);
      captureException(error, {
        context: { testType: 'basic' },
        level: 'error',
        tags: { feature: 'sentry-test' },
      });
      setLastError('Basic error captured and sent to Sentry');
    }
  };

  const testErrorWithContext = () => {
    addBreadcrumb({
      category: 'user-action',
      level: 'info',
      message: 'User clicked test button',
    });

    try {
      throw new Error('Error with breadcrumbs and context');
    } catch (error) {
      console.log('Capturing error with context...', error);
      captureException(error, {
        context: {
          action: 'testErrorWithContext',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
        level: 'warning',
        tags: {
          feature: 'sentry-test',
          testType: 'with-context',
        },
      });
      setLastError('Error with context captured and sent to Sentry');
    }
  };

  const testUncaughtError = () => {
    // This will be caught by Sentry's error boundary
    setTimeout(() => {
      throw new Error('Uncaught error from setTimeout');
    }, 100);
    setLastError('Uncaught error triggered (check console)');
  };

  const testPromiseRejection = () => {
    // This will be caught by Sentry's unhandled rejection handler
    Promise.reject(new Error('Unhandled promise rejection'));
    setLastError('Promise rejection triggered (check console)');
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Sentry Error Testing</h1>

      <div className="space-y-4">
        {lastError && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-800 ">
            <p className="font-semibold inline-block">Last action:</p>
            <p className="text-sm inline-block">
              <code>{lastError}</code>
            </p>
          </div>
        )}

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">1. Basic Error</h3>
          <p className="mb-3 text-sm text-gray-600">
            Captures a simple error with tags and context
          </p>
          <button
            type="button"
            onClick={testBasicError}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Trigger Basic Error
          </button>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">2. Error with Breadcrumbs</h3>
          <p className="mb-3 text-sm text-gray-600">
            Adds breadcrumbs before capturing error for better debugging
          </p>
          <button
            type="button"
            onClick={testErrorWithContext}
            className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Trigger Error with Context
          </button>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">3. Uncaught Error</h3>
          <p className="mb-3 text-sm text-gray-600">
            Throws an uncaught error that Sentry automatically captures
          </p>
          <button
            type="button"
            onClick={testUncaughtError}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Trigger Uncaught Error
          </button>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">4. Promise Rejection</h3>
          <p className="mb-3 text-sm text-gray-600">Triggers an unhandled promise rejection</p>
          <button
            type="button"
            onClick={testPromiseRejection}
            className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          >
            Trigger Promise Rejection
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold">How to Test in Production:</h3>
        <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700">
          <li>Deploy this page to Vercel (staging or production)</li>
          <li>Visit the deployed URL</li>
          <li>Click any test button</li>
          <li>Check your Sentry dashboard for the error</li>
        </ol>
      </div>
    </div>
  );
}
