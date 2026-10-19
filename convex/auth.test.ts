import { describe, expect, it } from 'vitest';

import { components } from './_generated/api';
import { createAuth } from './auth';
import { createConvexTest } from './test.setup';

const SIGN_UP_EMAIL = 'welcome-signup@example.com';
const SIGN_UP_NAME = 'Welcome User';
const SIGN_UP_PASSWORD = 'password123';

describe('welcome email on sign-up', () => {
  it('schedules one welcome email without blocking user creation', async () => {
    const t = createConvexTest();

    await t.run(async (ctx) => {
      await createAuth(ctx).api.signUpEmail({
        body: {
          email: SIGN_UP_EMAIL,
          name: SIGN_UP_NAME,
          password: SIGN_UP_PASSWORD,
        },
      });
    });

    const scheduled = await t.run(
      async (ctx) => await ctx.db.system.query('_scheduled_functions').collect()
    );
    const welcomeJobs = scheduled.filter((job) => {
      const [args] = job.args;

      return (
        typeof args === 'object' &&
        args !== null &&
        'email' in args &&
        args.email === SIGN_UP_EMAIL
      );
    });

    expect(welcomeJobs).toHaveLength(1);
    expect(welcomeJobs[0]?.args[0]).toMatchObject({
      email: SIGN_UP_EMAIL,
      name: SIGN_UP_NAME,
    });

    const createdUser = await t.run(
      async (ctx) =>
        await ctx.runQuery(components.betterAuth.adapter.findOne, {
          model: 'user',
          where: [{ field: 'email', value: SIGN_UP_EMAIL }],
        })
    );

    expect(createdUser).toMatchObject({
      email: SIGN_UP_EMAIL,
      name: SIGN_UP_NAME,
    });
  });
});
