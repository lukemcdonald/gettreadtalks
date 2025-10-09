import type { ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateTalkArgs = ObjectType<typeof validators.createTalkArgs>;
export type GetTalkArgs = ObjectType<typeof validators.getTalkArgs>;
export type GetTalkBySlugArgs = ObjectType<typeof validators.getTalkBySlugArgs>;
export type GetTalksByCollectionArgs = ObjectType<typeof validators.getTalksByCollectionArgs>;
export type GetTalksBySpeakerArgs = ObjectType<typeof validators.getTalksBySpeakerArgs>;
export type ListTalksArgs = ObjectType<typeof validators.listTalksArgs>;
export type UpdateTalkStatusArgs = ObjectType<typeof validators.updateTalkStatusArgs>;
