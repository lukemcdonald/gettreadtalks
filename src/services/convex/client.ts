'use client';

import { ConvexReactClient } from 'convex/react';
import invariant from 'tiny-invariant';

const CONVEX_CLIENT_KEY = '__treadTalksConvexReactClient__';

type ConvexGlobal = typeof globalThis & {
  [CONVEX_CLIENT_KEY]?: ConvexReactClient;
};

export function getConvexClient() {
  const global = globalThis as ConvexGlobal;
  const existing = global[CONVEX_CLIENT_KEY];

  if (existing) {
    return existing;
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  invariant(convexUrl, 'NEXT_PUBLIC_CONVEX_URL is not set');

  const client = new ConvexReactClient(convexUrl, {
    // Shared by account/manage layouts and public auth islands. Keep false so
    // signed-in islands can mount before client auth finishes syncing.
    expectAuth: false,
  });
  global[CONVEX_CLIENT_KEY] = client;

  return client;
}
