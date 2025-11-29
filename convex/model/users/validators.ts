import { v } from 'convex/values';

export const userRole = v.union(v.literal('admin'), v.literal('user'));
