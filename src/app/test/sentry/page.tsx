'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui';
import { DEPLOY_ENV } from '@/constants/env';
import { captureException, captureMessage } from '@/services/errors';

/**
 * Sentry Test Page
 *
 * TEMPORARY: This page is for testing Sentry setup across environments.
 * Once verified working in local, preview, and production, this can be removed.
 *
 * This page allows you to test Sentry error reporting across different environments.
 * Only available in non-production environments for security.
 */
export default function SentryTestPage() {
  const [lastEventId, setLastEventId] = useState<string | undefined>();
  const [testResult, setTestResult] = useState<string>('');
  const [sentryEnv, setSentryEnv] = useState<string>('');
  const [sentryDsn, setSentryDsn] = useState<string>('');
  const [vercelEnv, setVercelEnv] = useState<string>('');
  const [shouldThrowError, setShouldThrowError] = useState(false);

  useEffect(() => {
    // Wait a bit for Sentry to initialize, then check
    const checkSentry = () => {
      const sentry = (window as any).Sentry;

      if (sentry) {
        try {
          // Get Sentry environment from the client's options (most reliable)
          const client = sentry.getCurrentHub?.()?.getClient?.();
          const env =
            client?.getOptions?.()?.environment ||
            sentry.getCurrentHub?.()?.getScope?.()?.getTags?.()?.environment ||
            DEPLOY_ENV; // Fallback to DEPLOY_ENV constant
          setSentryEnv(env || 'Not detected');

          // Get DSN status (without exposing full DSN)
          const dsn = client?.getDsn?.()?.toString?.();
          setSentryDsn(dsn ? 'Set (hidden for security)' : 'Not set');
        } catch (error) {
          // If Sentry is partially initialized, show what we know
          setSentryEnv('Initializing...');
          setSentryDsn('Initializing...');
        }
      } else {
        setSentryEnv('Not detected');
        setSentryDsn('Not set');
      }

      // Note: VERCEL_ENV is server-side only, NEXT_PUBLIC_VERCEL_ENV might be manually set
      // The actual environment Sentry uses is DEPLOY_ENV (shown above)
      setVercelEnv(process.env.NEXT_PUBLIC_VERCEL_ENV || 'Not set (server-side only)');
    };

    // Check immediately
    checkSentry();

    // Also check after delays in case Sentry is still initializing
    const timeouts = [100, 500, 1000, 2000].map((delay) => setTimeout(checkSentry, delay));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Block in production only (allow local and preview/dev)
  if (DEPLOY_ENV === 'prod') {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>This test page is not available in production.</p>
      </div>
    );
  }

  // Throw error during render to trigger React error boundary
  // This must be outside the try-catch in handleTest
  if (shouldThrowError) {
    throw new Error('Test React error boundary from Sentry test page');
  }

  const handleTest = async (type: string) => {
    setTestResult('Testing...');
    setLastEventId(undefined);

    try {
      switch (type) {
        case 'client-error': {
          const error = new Error('Test client-side error from Sentry test page');
          const eventId = captureException(error, {
            context: {
              testType: 'client-error',
              timestamp: new Date().toISOString(),
            },
            extras: {
              testPage: true,
              environment: DEPLOY_ENV,
            },
            fingerprint: ['error', 'client-error'],
            level: 'error',
            tags: {
              test: 'true',
              source: 'sentry-test-page',
            },
          });
          setLastEventId(eventId);
          setTestResult(`Client error sent! Event ID: ${eventId || 'N/A'}`);
          break;
        }

        case 'client-message': {
          const eventId = captureMessage('Test message from Sentry test page', {
            level: 'info',
            tags: {
              test: 'true',
              source: 'sentry-test-page',
            },
            extras: {
              testPage: true,
              environment: DEPLOY_ENV,
            },
          });
          setLastEventId(eventId);
          setTestResult(`Message sent! Event ID: ${eventId || 'N/A'}`);
          break;
        }

        case 'client-warning': {
          const error = new Error('Test warning from Sentry test page');
          const eventId = captureException(error, {
            level: 'warning',
            tags: {
              test: 'true',
              source: 'sentry-test-page',
            },
            extras: {
              testPage: true,
              environment: DEPLOY_ENV,
            },
          });
          setLastEventId(eventId);
          setTestResult(`Warning sent! Event ID: ${eventId || 'N/A'}`);
          break;
        }

        case 'react-error': {
          // Set state to trigger error during render (outside try-catch)
          // This will actually trigger the React error boundary
          setShouldThrowError(true);
          break;
        }

        case 'api-error': {
          const response = await fetch('/api/test/sentry?type=error');
          const data = await response.json();
          setLastEventId(data.eventId);
          setTestResult(
            data.eventId
              ? `API error sent! Event ID: ${data.eventId}`
              : `Error: ${data.error || 'Failed to send error'}`,
          );
          break;
        }

        case 'api-message': {
          const response = await fetch('/api/test/sentry?type=message');
          const data = await response.json();
          setLastEventId(data.eventId);
          setTestResult(
            data.eventId
              ? `API message sent! Event ID: ${data.eventId}`
              : `Error: ${data.error || 'Failed to send message'}`,
          );
          break;
        }

        default:
          setTestResult('Unknown test type');
      }
    } catch (error) {
      setTestResult(`Test failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-10">
      <h1>Sentry Test Page</h1>

      <div className="flex flex-col gap-2">
        <h2>Environment Info</h2>
        <p>
          <strong>DEPLOY_ENV:</strong> {DEPLOY_ENV} (This is what Sentry uses for environment tag)
        </p>
        <p>
          <strong>VERCEL_ENV:</strong> {vercelEnv} (Note: Server-side only, may show manually set
          value)
        </p>
        <p>
          <strong>Sentry Environment Tag:</strong> {sentryEnv}
        </p>
        <p>
          <strong>Sentry DSN:</strong> {sentryDsn}
        </p>
        <p>
          Env Var Check: DSN={process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Set' : 'Not set'}, ENABLED=
          {process.env.NEXT_PUBLIC_SENTRY_ENABLED || 'default'}
        </p>
        <p>
          Browser Console Check: Open browser console (F12) and run: <code>window.Sentry</code>
        </p>
        {sentryEnv && sentryEnv !== DEPLOY_ENV && sentryEnv !== 'Not detected' && (
          <p style={{ color: 'red' }}>
            WARNING: Sentry environment ({sentryEnv}) does not match DEPLOY_ENV ({DEPLOY_ENV})
          </p>
        )}
      </div>

      {testResult && (
        <div className="flex flex-col gap-2">
          <p>{testResult}</p>
          {lastEventId && <p>Event ID: {lastEventId}</p>}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2>Client-Side Tests</h2>
        <Button onClick={() => handleTest('client-error')} type="button">
          Client Error
        </Button>
        <Button onClick={() => handleTest('client-message')} type="button">
          Client Message
        </Button>
        <Button onClick={() => handleTest('client-warning')} type="button">
          Client Warning
        </Button>
        <Button onClick={() => handleTest('react-error')} type="button">
          React Error Boundary
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h2>Server-Side Tests</h2>
        <Button onClick={() => handleTest('api-error')} type="button">
          API Error
        </Button>
        <Button onClick={() => handleTest('api-message')} type="button">
          API Message
        </Button>
      </div>
    </div>
  );
}
