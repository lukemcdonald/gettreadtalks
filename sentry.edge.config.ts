import * as Sentry from '@sentry/nextjs';

import { baseSentryConfig } from '@/configs/sentry';

Sentry.init(baseSentryConfig);
