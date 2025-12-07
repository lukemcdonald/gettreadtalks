'use server';

import 'server-only';

import { getAuthToken } from '@/services/auth/server';

/**
 * Wrapper function for Server Actions that need to call Convex mutations.
 * Automatically retrieves and passes the authentication token to the callback.
 * The auth token is cached per request, so multiple calls won't cause redundant cookie reads.
 *
 * @param callback - Function that receives the auth token and performs the Convex operation
 * @returns The result of the callback function
 *
 * @example
 * ```ts
 * const result = await withConvexAuth(async (token) => {
 *   return await fetchMutation(api.talks.createTalk, data, { token });
 * });
 * ```
 */
export async function withConvexAuth<T>(callback: (token?: string) => Promise<T>): Promise<T> {
  const token = await getAuthToken();
  return callback(token ?? undefined);
}
