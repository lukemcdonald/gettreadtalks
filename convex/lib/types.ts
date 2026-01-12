import type { Infer } from 'convex/values';
import type { statusFilterType, statusType } from './validators/shared';

export type StatusFilterType = Infer<typeof statusFilterType>;
export type StatusType = Infer<typeof statusType>;
