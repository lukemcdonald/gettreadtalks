import { NextResponse } from 'next/server';

import { DEPLOY_ENV } from '@/constants/env';
import { captureException, captureMessage } from '@/services/errors';

/**
 * Sentry Test API Route
 *
 * TEMPORARY: This route is for testing Sentry setup.
 * Once verified working in local, preview, and production, this can be removed.
 *
 * This API route allows you to test server-side Sentry error reporting.
 * Only available in non-production environments for security.
 *
 * Usage:
 * - GET /api/test/sentry?type=error - Test server-side error
 * - GET /api/test/sentry?type=message - Test server-side message
 */
export async function GET(request: Request) {
  // Block in production only (allow local and preview/dev)
  if (DEPLOY_ENV === 'prod') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'error': {
        const error = new Error('Test server-side error from Sentry test API');
        const eventId = captureException(error, {
          context: {
            testType: 'api-error',
            timestamp: new Date().toISOString(),
            requestUrl: request.url,
          },
          extras: {
            testApi: true,
            environment: DEPLOY_ENV,
            method: 'GET',
          },
          fingerprint: ['error', 'api-error'],
          level: 'error',
          tags: {
            test: 'true',
            source: 'sentry-test-api',
          },
        });

        return NextResponse.json({
          success: true,
          eventId,
          message: 'Server-side error sent to Sentry',
          debug: {
            deployEnv: DEPLOY_ENV,
            hasEventId: !!eventId,
            sentryEnabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
            hasDsn: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
          },
        });
      }

      case 'message': {
        const eventId = captureMessage('Test server-side message from Sentry test API', {
          level: 'info',
          tags: {
            test: 'true',
            source: 'sentry-test-api',
          },
          extras: {
            testApi: true,
            environment: DEPLOY_ENV,
            method: 'GET',
          },
        });

        return NextResponse.json({
          success: true,
          eventId,
          message: 'Server-side message sent to Sentry',
        });
      }

      default:
        return NextResponse.json(
          {
            error: 'Invalid type parameter. Use ?type=error or ?type=message',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
      { status: 500 },
    );
  }
}
