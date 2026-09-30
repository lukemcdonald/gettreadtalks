/**
 * NODE_ENV is the Node/Next runtime mode (development, production, test).
 * `next dev` is development. `next build`, `next start`, and every Vercel
 * deploy (preview and production) are production.
 *
 * NEXT_PUBLIC_VERCEL_ENV is the Vercel target (production, preview,
 * development). Vercel inlines it at build time. Unset locally.
 *
 * DEPLOY_ENV is a Sentry label derived from that Vercel target:
 * production → prod, preview → dev, anything else → local.
 */

type DeployEnvironment = 'prod' | 'dev' | 'local';

export const DEPLOY_ENV = getStandardizedEnvironment();

export const IS_DEV = process.env.NODE_ENV === 'development';

export const LOG_ANALYTICS_TO_CONSOLE =
  IS_DEV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

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
