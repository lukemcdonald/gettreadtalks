/**
 * Environment constants
 */

// Runtime
export const IS_BROWSER = typeof window !== 'undefined';
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_LOCAL = !process.env.VERCEL;
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

/**
 * Application environment name
 *
 * Automatically detects from Vercel's VERCEL_ENV:
 * - 'local' = No VERCEL_ENV (running on your machine)
 * - 'dev' = VERCEL_ENV=development
 * - 'preview' = VERCEL_ENV=preview
 * - 'prod' = VERCEL_ENV=production
 *
 * Matches Convex environment names for consistent Sentry tagging.
 */
export const APP_ENV = getAppEnvironment();

function getAppEnvironment(): 'local' | 'dev' | 'preview' | 'prod' {
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv === 'production') return 'prod';
  if (vercelEnv === 'preview') return 'preview';
  if (vercelEnv === 'development') return 'dev';

  return 'local';
}
