import type { StatusType } from '@/convex/lib/validators/shared';

export type ContentWithStatus = {
  status: StatusType;
};

export type ContentWithTimestamps = {
  _creationTime: number;
  publishedAt?: number;
  updatedAt?: number;
};
