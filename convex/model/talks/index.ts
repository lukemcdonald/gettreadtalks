import type { ObjectType } from 'convex/values';

import * as mutations from './mutations';
import * as queries from './queries';
import * as validators from './validators';
import { talkFields, talkTables } from './schema';

// Re-export organized by concern
export { mutations, queries, talkFields, talkTables, validators };

// Export inferred types for use elsewhere
export type CreateTalkArgs = ObjectType<typeof validators.createTalkArgs>;
export type GetTalkArgs = ObjectType<typeof validators.getTalkArgs>;
export type GetTalkBySlugArgs = ObjectType<typeof validators.getTalkBySlugArgs>;
export type GetTalksByCollectionArgs = ObjectType<typeof validators.getTalksByCollectionArgs>;
export type GetTalksBySpeakerArgs = ObjectType<typeof validators.getTalksBySpeakerArgs>;
export type ListTalksArgs = ObjectType<typeof validators.listTalksArgs>;
export type UpdateTalkStatusArgs = ObjectType<typeof validators.updateTalkStatusArgs>;
