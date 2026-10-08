import * as Sentry from '@sentry/nextjs';

import { baseSentryConfig } from './index';

Sentry.init(baseSentryConfig);
