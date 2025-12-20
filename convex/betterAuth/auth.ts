import { createAuth } from '../auth';

/**
 * Export a static instance for Better Auth schema generation.
 *
 * @link https://labs.convex.dev/better-auth/features/local-install
 */
export const auth = createAuth({} as any);
