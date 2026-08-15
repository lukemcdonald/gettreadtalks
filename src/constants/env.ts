/**
 * Environment constants
 *
 * Standardized environment naming for Sentry integration:
 * - "prod": Production deployment on Vercel
 * - "dev": Preview deployment on Vercel
 * - "local": Local development
 *
 * - NODE_ENV: What operation mode Node.js is running in (development/production/test)
 * - DEPLOY_ENV: What environment the app is running in (prod/dev/local)
 *
 * Requires NEXT_PUBLIC_VERCEL_ENV set in Vercel project settings to ${VERCEL_ENV}.
 * Using NEXT_PUBLIC_* ensures the same variable works in both server and client contexts.
 */

type DeployEnvironment = 'prod' | 'dev' | 'local';

// NODE_ENV based constants (for debugging behavior)
export const IS_DEV = process.env.NODE_ENV === 'development';

// Standardized environment constants (for Sentry integration)
export const DEPLOY_ENV = getStandardizedEnvironment();

function getStandardizedEnvironment(): DeployEnvironment {
  switch (process.env.NEXT_PUBLIC_VERCEL_ENV) {
    case 'production': {
      return 'prod';
    }
    case 'preview': {
      return 'dev';
    }
    default: {
      return 'local';
    }
  }
}
