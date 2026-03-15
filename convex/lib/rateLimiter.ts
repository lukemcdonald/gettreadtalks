import { HOUR, RateLimiter } from '@convex-dev/rate-limiter';

import { components } from '../_generated/api';

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  signIn: { capacity: 20, kind: 'token bucket', period: HOUR, rate: 10 },
});
