import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateTopicArgs = ObjectType<typeof validators.createTopicArgs>;
export type CreateTopicReturns = Infer<typeof validators.createTopicReturns>;
export type DeleteTopicArgs = ObjectType<typeof validators.deleteTopicArgs>;
export type DeleteTopicReturns = Infer<typeof validators.deleteTopicReturns>;
export type GetTopicArgs = ObjectType<typeof validators.getTopicArgs>;
export type GetTopicBySlugArgs = ObjectType<typeof validators.getTopicBySlugArgs>;
export type GetTopicBySlugReturns = Infer<typeof validators.getTopicBySlugReturns>;
export type GetTopicReturns = Infer<typeof validators.getTopicReturns>;
export type GetTopicsWithCountArgs = ObjectType<typeof validators.getTopicsWithCountArgs>;
export type GetTopicsWithCountReturns = Infer<typeof validators.getTopicsWithCountReturns>;
export type GetTopicWithContentArgs = ObjectType<typeof validators.getTopicWithContentArgs>;
export type GetTopicWithContentReturns = Infer<typeof validators.getTopicWithContentReturns>;
export type ListTopicsArgs = ObjectType<typeof validators.listTopicsArgs>;
export type ListTopicsReturns = Infer<typeof validators.listTopicsReturns>;
export type UpdateTopicArgs = ObjectType<typeof validators.updateTopicArgs>;
export type UpdateTopicReturns = Infer<typeof validators.updateTopicReturns>;
