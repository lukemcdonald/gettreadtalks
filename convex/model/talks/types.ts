import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateTalkArgs = ObjectType<typeof validators.createTalkArgs>;
export type CreateTalkReturns = Infer<typeof validators.createTalkReturns>;
export type DeleteTalkArgs = ObjectType<typeof validators.deleteTalkArgs>;
export type DeleteTalkReturns = Infer<typeof validators.deleteTalkReturns>;
export type GetTalkArgs = ObjectType<typeof validators.getTalkArgs>;
export type GetTalkBySlugArgs = ObjectType<typeof validators.getTalkBySlugArgs>;
export type GetTalkBySlugReturns = Infer<typeof validators.getTalkBySlugReturns>;
export type GetTalkReturns = Infer<typeof validators.getTalkReturns>;
export type ListTalksArgs = ObjectType<typeof validators.listTalksArgs>;
export type ListTalksReturns = Infer<typeof validators.listTalksReturns>;
export type ListTalksByCollectionArgs = ObjectType<typeof validators.listTalksByCollectionArgs>;
export type ListTalksByCollectionReturns = Infer<typeof validators.listTalksByCollectionReturns>;
export type ListTalksBySpeakerArgs = ObjectType<typeof validators.listTalksBySpeakerArgs>;
export type ListTalksBySpeakerReturns = Infer<typeof validators.listTalksBySpeakerReturns>;
export type ListTalksWithSpeakersArgs = ObjectType<typeof validators.listTalksWithSpeakersArgs>;
export type ListTalksWithSpeakersReturns = Infer<typeof validators.listTalksWithSpeakersReturns>;
export type UpdateTalkArgs = ObjectType<typeof validators.updateTalkArgs>;
export type UpdateTalkReturns = Infer<typeof validators.updateTalkReturns>;
export type UpdateTalkStatusArgs = ObjectType<typeof validators.updateTalkStatusArgs>;
export type UpdateTalkStatusReturns = Infer<typeof validators.updateTalkStatusReturns>;
