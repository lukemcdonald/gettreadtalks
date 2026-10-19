import { describe, expect, it } from 'vitest';

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
});
