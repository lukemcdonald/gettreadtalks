import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

export const test = base.extend({
  context: async ({ baseURL, context }, provide) => {
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

    if (bypassSecret && baseURL) {
      const { origin } = new URL(baseURL);

      await context.route(
        (url) => url.origin === origin,
        async (route) => {
          await route.continue({
            headers: {
              ...route.request().headers(),
              'x-vercel-protection-bypass': bypassSecret,
              'x-vercel-set-bypass-cookie': 'true',
            },
          });
        }
      );
    }

    await provide(context);
  },
});
