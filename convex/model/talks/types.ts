import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateTalkArgs = ObjectType<typeof validators.createTalkArgs>;
export type CreateTalkReturns = Infer<typeof validators.createTalkReturns>;
export type GetTalkArgs = ObjectType<typeof validators.getTalkArgs>;
export type GetTalkBySlugArgs = ObjectType<typeof validators.getTalkBySlugArgs>;
export type GetTalkBySlugReturns = Infer<typeof validators.getTalkBySlugReturns>;
export type GetTalkReturns = Infer<typeof validators.getTalkReturns>;
export type GetTalksByCollectionArgs = ObjectType<typeof validators.getTalksByCollectionArgs>;
export type GetTalksByCollectionReturns = Infer<typeof validators.getTalksByCollectionReturns>;
export type GetTalksBySpeakerArgs = ObjectType<typeof validators.getTalksBySpeakerArgs>;
export type GetTalksBySpeakerReturns = Infer<typeof validators.getTalksBySpeakerReturns>;
export type ListTalksArgs = ObjectType<typeof validators.listTalksArgs>;
export type ListTalksReturns = Infer<typeof validators.listTalksReturns>;
export type UpdateTalkStatusArgs = ObjectType<typeof validators.updateTalkStatusArgs>;
export type UpdateTalkStatusReturns = Infer<typeof validators.updateTalkStatusReturns>;
