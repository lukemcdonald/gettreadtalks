import { getErrorMessage } from './utils';

/**
 * Fallback Sentry reporting for environments with no native exception
 * integration (e.g. Convex's Free plan). Fire and forget: never throws.
 */
export async function reportSentryException(params: {
  message: string;
  tags?: Record<string, string>;
}): Promise<void> {
  try {
    const dsn = process.env.SENTRY_DSN;
    const parsedDsn = dsn ? parseSentryDsn(dsn) : null;

    if (!parsedDsn) {
      console.error(
        'Sentry event dropped: SENTRY_DSN is not configured or malformed.'
      );
      return;
    }

    const eventId = crypto.randomUUID().replaceAll('-', '');
    const sentAt = new Date().toISOString();

    const event = {
      event_id: eventId,
      exception: {
        values: [{ type: 'Error', value: params.message }],
      },
      level: 'error',
      platform: 'node',
      // Distinguishes Convex-originated events from the frontend's, since both
      // sides can share one Sentry DSN.
      tags: { service: 'convex', ...params.tags },
      timestamp: sentAt,
    };

    const envelope = [
      JSON.stringify({ dsn, event_id: eventId, sent_at: sentAt }),
      JSON.stringify({ type: 'event' }),
      JSON.stringify(event),
      '',
    ].join('\n');

    const response = await fetch(parsedDsn.ingestUrl, {
      body: envelope,
      headers: { 'Content-Type': 'application/x-sentry-envelope' },
      method: 'POST',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error('Sentry rejected the event envelope:', response.status);
    }
  } catch (error) {
    console.error('Failed to report event to Sentry:', getErrorMessage(error));
  }
}

/**
 * Derives the ingest envelope URL from a Sentry DSN. The DSN itself travels
 * in the envelope header for auth, so the public key isn't needed separately.
 */
function parseSentryDsn(dsn: string): { ingestUrl: string } | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.slice(1);

    if (!(url.username && projectId)) {
      return null;
    }

    return {
      ingestUrl: `${url.protocol}//${url.host}/api/${projectId}/envelope/`,
    };
  } catch {
    return null;
  }
}
