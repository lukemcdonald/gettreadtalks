import { cronJobs } from 'convex/server';

import { internal } from './_generated/api';
import {
  MEDIA_HEALTH_CRON_ARGS,
  MEDIA_HEALTH_CRON_IDENTIFIER,
  MEDIA_HEALTH_CRON_SPEC,
} from './model/mediaHealth/cronJob';

const crons = cronJobs();

crons.cron(
  MEDIA_HEALTH_CRON_IDENTIFIER,
  MEDIA_HEALTH_CRON_SPEC,
  internal.mediaHealth.checkPublishedMedia,
  MEDIA_HEALTH_CRON_ARGS
);

export default crons;
