import type { Id } from '@/convex/_generated/dataModel';

export type MediaCheckId = Id<'mediaChecks'>;

export interface OpenMediaCheck {
  _id: MediaCheckId;
  adminPath: string;
  firstBrokenAt: number;
  mediaUrl: string;
  publicPath: string | null;
  status: 'missing' | 'private';
  title: string;
}
