import { describe, expect, it } from 'vitest';

import { internal } from './_generated/api';
import { createConvexTest } from './test.setup';

describe('sendWelcomeEmail', () => {
  it('skips non-resend.dev recipients in test mode without throwing', async () => {
    const t = createConvexTest();

    await expect(
      t.action(internal.emails.sendWelcomeEmail, {
        email: 'person@example.com',
        name: 'Pat',
        userId: 'user_1',
      })
    ).resolves.toBeNull();
  });
});
