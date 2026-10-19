import { afterEach, describe, expect, it } from 'vitest';

import { internal } from '../_generated/api';
import { createConvexTest } from '../test.setup';
import { MediaHealthEmail } from './mediaHealth';
import { renderEmailTemplate } from './render';
import { WelcomeEmail } from './welcome';

describe('renderEmailTemplate', () => {
  it('renders welcome markup in the Convex V8 runtime', () => {
    const { html, text } = renderEmailTemplate(
      WelcomeEmail({
        email: 'luke@example.test',
        name: 'Luke',
        siteUrl: 'https://www.gettreadtalks.com',
      })
    );

    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('Welcome to TREAD Talks, Luke!');
    expect(html).toContain('https://www.gettreadtalks.com');
    expect(text).toContain('Hi Luke');
  });

  it('renders digest markup in the Convex V8 runtime', () => {
    const { html, text } = renderEmailTemplate(
      MediaHealthEmail({
        items: [
          {
            adminPath: '/manage/talks/talk123',
            entityTable: 'talks',
            firstBrokenAt: Date.UTC(2026, 9, 19),
            mediaUrl: 'https://youtu.be/0SVTl4Xa5fY',
            newStatus: 'private',
            publicPath: '/talks/john-bunyan/grace-abounding',
            title: 'Grace Abounding',
          },
        ],
        siteUrl: 'https://www.gettreadtalks.com',
        stillOpenCount: 3,
        stillOpenHref: 'https://www.gettreadtalks.com/manage/media',
      })
    );

    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('Grace Abounding');
    expect(html).toContain('https://www.youtube.com/watch?v=0SVTl4Xa5fY');
    expect(html).toContain('/manage/media');
    expect(text).toContain('3 still open');
  });
});

describe('email send handlers', () => {
  const originalSiteUrl = process.env.SITE_URL;

  afterEach(() => {
    if (originalSiteUrl === undefined) {
      delete process.env.SITE_URL;
      return;
    }

    process.env.SITE_URL = originalSiteUrl;
  });

  it('runs welcome render through the Convex mutation', async () => {
    process.env.SITE_URL = 'https://localhost:3000';
    const t = createConvexTest();

    await expect(
      t.mutation(internal.emails.sendWelcomeEmail, {
        email: 'luke@example.test',
        name: 'Luke',
        userId: 'users:luke',
      })
    ).resolves.toBe(null);
  });

  it('runs digest render through the Convex action', async () => {
    const t = createConvexTest();

    await expect(
      t.action(internal.emails.sendMediaHealthEmail, {
        items: [
          {
            adminPath: '/manage/talks/talk123',
            entityTable: 'talks',
            firstBrokenAt: Date.UTC(2026, 9, 19),
            mediaUrl: 'https://youtu.be/0SVTl4Xa5fY',
            newStatus: 'private',
            publicPath: '/talks/john-bunyan/grace-abounding',
            title: 'Grace Abounding',
          },
        ],
        siteUrl: 'https://www.gettreadtalks.com',
        stillOpenCount: 3,
      })
    ).resolves.toBe(false);
  });
});
