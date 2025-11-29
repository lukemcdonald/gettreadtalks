import { getStaticAuth } from '@convex-dev/better-auth';

import { createAuth } from '../auth';

/**
 * Static auth export for Better Auth schema generation.
 * The CLI needs this to generate the schema.
 */
export const auth = getStaticAuth(createAuth);
