/**
 * Environment constants
 *
 * Standardized environment naming for Sentry integration:
 * - "prod": Production deployment on Vercel
 * - "dev": Preview deployment on Vercel
 * - "local": Local development
 *
 * - NODE_ENV: What operation mode Node.js is running in (development/production/test)
 * - DEPLOY_ENV: What environment the server is running in (prod/dev/local)
 */

type DeployEnvironment = 'prod' | 'dev' | 'local';

export const IS_BROWSER = typeof window !== 'undefined';

// NODE_ENV based constants (for debugging behavior)
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

// Standardized environment constants (for Sentry integration)
export const DEPLOY_ENV = getStandardizedEnvironment();
export const IS_LOCAL = DEPLOY_ENV === 'local';
export const IS_PREVIEW = DEPLOY_ENV === 'dev'; // Preview deployments are "dev"

function getStandardizedEnvironment(): DeployEnvironment {
  switch (process.env.VERCEL_ENV) {
    case 'production':
      return 'prod';
    case 'preview':
      return 'dev';
    default:
      return 'local';
  }
}
