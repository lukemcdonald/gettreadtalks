import { describe, expect, it } from '@/test';

import robots from './robots';

function getRules() {
  const { rules } = robots();

  return Array.isArray(rules) ? rules : [rules];
}

function getUserAgents(rule: { userAgent?: string | string[] }) {
  if (rule.userAgent === undefined) {
    return [];
  }

  return Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];
}

describe('robots', () => {
  it('allows public pages for search engines and lists the sitemap', () => {
    const manifest = robots();
    const defaultRule = getRules().find((rule) =>
      getUserAgents(rule).includes('*')
    );

    expect(Array.isArray(manifest.rules)).toBe(true);
    expect(defaultRule?.allow).toBe('/');
    expect(defaultRule?.disallow).toEqual(
      expect.arrayContaining([
        '/account',
        '/api/',
        '/forgot-password',
        '/login',
        '/logout',
        '/manage',
        '/mcp',
        '/register',
        '/reset-password',
        '/*/edit',
        '/*/new',
      ])
    );
    expect(defaultRule?.disallow).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/\?/u)])
    );
    expect(manifest.sitemap).toMatch(/^https:\/\/.+\/sitemap\.xml$/u);
  });

  it('disallows AI training crawlers without blocking Googlebot', () => {
    const blockedAgents = getRules()
      .filter((rule) => {
        const { disallow } = rule;

        return (
          disallow === '/' ||
          (Array.isArray(disallow) && disallow.includes('/'))
        );
      })
      .flatMap((rule) => getUserAgents(rule));

    expect(blockedAgents).toEqual(
      expect.arrayContaining([
        'Anthropic-AI',
        'Bytespider',
        'CCBot',
        'ClaudeBot',
        'Google-Extended',
        'GPTBot',
      ])
    );
    expect(blockedAgents).not.toContain('*');
    expect(blockedAgents).not.toContain('Googlebot');
  });
});
