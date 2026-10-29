import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import type { Infer } from 'convex/values';

import { v } from 'convex/values';

import { topicFields } from './schema';

const topicValidator = v.object(topicFields);

type TopicFields = Infer<typeof topicValidator>;

export function makeTopic(overrides: Partial<TopicFields> = {}): TopicFields {
  return {
    slug: 'grace',
    title: 'Grace',
    ...overrides,
  };
}

export async function insertTopic(
  ctx: MutationCtx,
  overrides: Partial<TopicFields> = {}
) {
  return await ctx.db.insert('topics', makeTopic(overrides));
}

export async function insertTalkOnTopic(
  ctx: MutationCtx,
  fields: {
    talkId: Id<'talks'>;
    topicId: Id<'topics'>;
  }
) {
  return await ctx.db.insert('talksOnTopics', fields);
}
