import type { ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateTopicArgs = ObjectType<typeof validators.createTopicArgs>;
export type GetTopicArgs = ObjectType<typeof validators.getTopicArgs>;
export type GetTopicBySlugArgs = ObjectType<typeof validators.getTopicBySlugArgs>;
export type GetTopicWithContentArgs = ObjectType<typeof validators.getTopicWithContentArgs>;
export type ListTopicsArgs = ObjectType<typeof validators.listTopicsArgs>;
export type UpdateTopicArgs = ObjectType<typeof validators.updateTopicArgs>;
