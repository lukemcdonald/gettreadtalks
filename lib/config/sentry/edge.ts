import * as Sentry from '@sentry/nextjs';

import { baseSentryConfig } from './index';

// Edge runtime has limitations, so config is minimal
Sentry.init(baseSentryConfig);
