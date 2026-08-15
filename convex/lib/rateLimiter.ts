import { HOUR, RateLimiter } from '@convex-dev/rate-limiter';

import { components } from '../_generated/api';

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  changePassword: {
    capacity: 15,
    kind: 'token bucket',
    period: HOUR,
    rate: 10,
  },
  passwordReset: { capacity: 5, kind: 'token bucket', period: HOUR, rate: 3 },
  signIn: { capacity: 20, kind: 'token bucket', period: HOUR, rate: 10 },
  signUp: { capacity: 10, kind: 'token bucket', period: HOUR, rate: 5 },
});
