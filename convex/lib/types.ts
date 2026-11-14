import type {
  publishStateFilter,
  statusFilterType,
  statusType,
} from './validators/shared';
import type { Infer } from 'convex/values';

export type PublishStateFilter = Infer<typeof publishStateFilter>;
export type StatusFilterType = Infer<typeof statusFilterType>;
export type StatusType = Infer<typeof statusType>;
