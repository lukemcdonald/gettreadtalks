import type { statusFilterType, statusType } from './validators/shared';
import type { Infer } from 'convex/values';

export type StatusFilterType = Infer<typeof statusFilterType>;
export type StatusType = Infer<typeof statusType>;
