import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const emailSuppressionFields = {
  bounceSubType: v.optional(v.string()),
  bounceType: v.optional(v.string()),
  email: v.string(),
  reason: v.union(v.literal('bounced'), v.literal('complained')),
  resendEmailId: v.optional(v.string()),
  suppressedAt: v.number(),
};

export const emailTables = {
  emailSuppressions: defineTable(emailSuppressionFields).index('by_email', ['email']),
};
