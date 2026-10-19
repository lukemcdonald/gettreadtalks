import 'server-only';
import type { EventMap } from './events';

import { after } from 'next/server';

import { LOG_ANALYTICS_TO_CONSOLE } from '@/constants/env';

import { isSegmentEnabled } from './enabled';
import { logAnalytics } from './log';

const SEGMENT_TRACK_URL = 'https://api.segment.io/v1/track';
const writeKey = process.env.SEGMENT_WRITE_KEY;
const segmentEnabled = isSegmentEnabled(
  writeKey,
  process.env.NEXT_PUBLIC_SEGMENT_ENABLED
);

interface ServerTrackPayload<E extends keyof EventMap = keyof EventMap> {
  anonymousId: string;
  event: E;
  properties: EventMap[E] extends Record<string, never>
    ? Record<string, never>
    : EventMap[E];
  userId?: string;
}

function canTrackServer() {
  return Boolean(segmentEnabled || LOG_ANALYTICS_TO_CONSOLE);
}

async function sendSegmentTrack(payload: ServerTrackPayload) {
  if (!segmentEnabled || !writeKey) {
    return;
  }

  const response = await fetch(SEGMENT_TRACK_URL, {
    body: JSON.stringify({
      anonymousId: payload.anonymousId,
      event: payload.event,
      properties: payload.properties,
      timestamp: new Date().toISOString(),
      type: 'track',
      ...(payload.userId ? { userId: payload.userId } : {}),
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(`${writeKey}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    console.error('[analytics]: segment track failed', response.status);
  }
}

/**
 * Run analytics after the response. No-op without a write key or console logging.
 */
export function scheduleServerTrack(build: () => Promise<ServerTrackPayload>) {
  if (!canTrackServer()) {
    return;
  }

  const run = async () => {
    try {
      const payload = await build();

      logAnalytics(payload.event, payload.properties);
      await sendSegmentTrack(payload);
    } catch (error: unknown) {
      console.error('[analytics]', error);
    }
  };

  try {
    after(run);
  } catch {
    void run();
  }
}
