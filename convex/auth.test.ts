import type { DataModel } from './_generated/dataModel';
import type { GenericCtx } from '@convex-dev/better-auth';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { components } from './_generated/api';
import { createAuth } from './auth';
import { createConvexTest } from './test.setup';

const ORIGINAL_CLOUD_URL = process.env.CONVEX_CLOUD_URL;
const ORIGINAL_SITE_URL = process.env.SITE_URL;
const SIGN_UP_EMAIL = 'welcome-signup@example.com';
const SIGN_UP_NAME = 'Welcome User';
const SIGN_UP_PASSWORD = 'password123';

afterEach(() => {
  if (ORIGINAL_CLOUD_URL === undefined) {
    delete process.env.CONVEX_CLOUD_URL;
  } else {
    process.env.CONVEX_CLOUD_URL = ORIGINAL_CLOUD_URL;
  }

  if (ORIGINAL_SITE_URL === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = ORIGINAL_SITE_URL;
  }
});

describe('createAuth', () => {
  it('evaluates during Convex analysis without SITE_URL', () => {
    process.env.CONVEX_CLOUD_URL = 'https://preview.convex.cloud';
    delete process.env.SITE_URL;

    expect(() => createAuth({} as GenericCtx<DataModel>)).not.toThrow();
  });
});

describe('welcome email on sign-up', () => {
  it('schedules one welcome email and still creates the user if send fails', async () => {
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

    vi.useFakeTimers();
    await t.finishAllScheduledFunctions(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();

    const userAfterSend = await t.run(
      async (ctx) =>
        await ctx.runQuery(components.betterAuth.adapter.findOne, {
          model: 'user',
          where: [{ field: 'email', value: SIGN_UP_EMAIL }],
        })
    );

    expect(userAfterSend).toMatchObject({
      email: SIGN_UP_EMAIL,
      name: SIGN_UP_NAME,
    });
  });
});
