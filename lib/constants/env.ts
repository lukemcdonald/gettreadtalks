/**
 * Environment constants
 */

export const IS_BROWSER = typeof window !== 'undefined';
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_LOCAL = !process.env.VERCEL;
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

export const APP_ENV = getAppEnvironment();

function getAppEnvironment(): 'local' | 'dev' | 'preview' | 'prod' {
  const NODE_ENV = process.env.NODE_ENV;

  if (NODE_ENV === 'production') return 'prod';
  if (NODE_ENV === 'development') return 'dev';

  return 'local';
}
