/**
 * Environment constants
 */

export const IS_BROWSER = typeof window !== 'undefined';
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_LOCAL = !process.env.VERCEL;
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

/**
 * Application environment name
 *
 * - Automatically detects from Vercel's environment variables
 * - Matches Convex environment names for consistent Sentry tagging.
 */
export const APP_ENV = getAppEnvironment();

function getAppEnvironment(): 'local' | 'dev' | 'preview' | 'prod' {
  const VERCEL_ENV = process.env.VERCEL_ENV;

  // Handle production variants (Vercel docs specify exact values, but being defensive)
  if (VERCEL_ENV === 'production') return 'prod';
  if (VERCEL_ENV === 'preview') return 'preview';
  if (VERCEL_ENV === 'development') return 'dev';

  return 'local';
}
