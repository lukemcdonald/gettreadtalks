import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateSpeakerArgs = ObjectType<typeof validators.createSpeakerArgs>;
export type CreateSpeakerReturns = Infer<typeof validators.createSpeakerReturns>;
export type DestroySpeakerArgs = ObjectType<typeof validators.destroySpeakerArgs>;
export type DestroySpeakerReturns = Infer<typeof validators.destroySpeakerReturns>;
export type GetFeaturedSpeakersArgs = ObjectType<typeof validators.getFeaturedSpeakersArgs>;
export type GetFeaturedSpeakersReturns = Infer<typeof validators.getFeaturedSpeakersReturns>;
export type GetSpeakerArgs = ObjectType<typeof validators.getSpeakerArgs>;
export type GetSpeakerBySlugArgs = ObjectType<typeof validators.getSpeakerBySlugArgs>;
export type GetSpeakerBySlugReturns = Infer<typeof validators.getSpeakerBySlugReturns>;
export type GetSpeakerReturns = Infer<typeof validators.getSpeakerReturns>;
export type GetSpeakersCountArgs = ObjectType<typeof validators.getSpeakersCountArgs>;
export type GetSpeakersCountReturns = Infer<typeof validators.getSpeakersCountReturns>;
export type ListSpeakersArgs = ObjectType<typeof validators.listSpeakersArgs>;
export type ListSpeakersReturns = Infer<typeof validators.listSpeakersReturns>;
export type UpdateSpeakerArgs = ObjectType<typeof validators.updateSpeakerArgs>;
export type UpdateSpeakerReturns = Infer<typeof validators.updateSpeakerReturns>;
