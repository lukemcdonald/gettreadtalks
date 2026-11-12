import type { MetadataRoute } from 'next';

import { buildAbsoluteUrl } from '@/lib/entities/paths';

const AI_TRAINING_CRAWLERS = [
  'Amazonbot',
  'Anthropic-AI',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'ClaudeBot',
  'Google-Extended',
  'GPTBot',
  'Meta-ExternalAgent',
];

const DISALLOW_PATHS = [
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
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        allow: '/',
        disallow: DISALLOW_PATHS,
        userAgent: '*',
      },
      {
        disallow: '/',
        userAgent: AI_TRAINING_CRAWLERS,
      },
    ],
    sitemap: buildAbsoluteUrl('/sitemap.xml'),
  };
}
