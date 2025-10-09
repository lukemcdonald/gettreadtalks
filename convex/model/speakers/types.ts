import type { ObjectType } from 'convex/values';

import * as validators from './validators';

export type CreateSpeakerArgs = ObjectType<typeof validators.createSpeakerArgs>;
export type GetSpeakerArgs = ObjectType<typeof validators.getSpeakerArgs>;
export type GetSpeakerBySlugArgs = ObjectType<typeof validators.getSpeakerBySlugArgs>;
export type ListSpeakersArgs = ObjectType<typeof validators.listSpeakersArgs>;
export type UpdateSpeakerArgs = ObjectType<typeof validators.updateSpeakerArgs>;
