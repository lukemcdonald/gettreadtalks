import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type AddFavoriteClipArgs = ObjectType<typeof validators.addFavoriteClipArgs>;
export type AddFavoriteClipReturns = Infer<typeof validators.addFavoriteClipReturns>;
export type AddFavoriteSpeakerArgs = ObjectType<typeof validators.addFavoriteSpeakerArgs>;
export type AddFavoriteSpeakerReturns = Infer<typeof validators.addFavoriteSpeakerReturns>;
export type AddFavoriteTalkArgs = ObjectType<typeof validators.addFavoriteTalkArgs>;
export type AddFavoriteTalkReturns = Infer<typeof validators.addFavoriteTalkReturns>;
export type AddFinishedTalkArgs = ObjectType<typeof validators.addFinishedTalkArgs>;
export type AddFinishedTalkReturns = Infer<typeof validators.addFinishedTalkReturns>;
export type ListUserFavoritesArgs = ObjectType<typeof validators.listUserFavoritesArgs>;
export type ListUserFavoritesReturns = Infer<typeof validators.listUserFavoritesReturns>;
export type ListUserFinishedTalksArgs = ObjectType<typeof validators.listUserFinishedTalksArgs>;
export type ListUserFinishedTalksReturns = Infer<typeof validators.listUserFinishedTalksReturns>;
export type RemoveFavoriteClipArgs = ObjectType<typeof validators.removeFavoriteClipArgs>;
export type RemoveFavoriteClipReturns = Infer<typeof validators.removeFavoriteClipReturns>;
export type RemoveFavoriteSpeakerArgs = ObjectType<typeof validators.removeFavoriteSpeakerArgs>;
export type RemoveFavoriteSpeakerReturns = Infer<typeof validators.removeFavoriteSpeakerReturns>;
export type RemoveFavoriteTalkArgs = ObjectType<typeof validators.removeFavoriteTalkArgs>;
export type RemoveFavoriteTalkReturns = Infer<typeof validators.removeFavoriteTalkReturns>;
export type RemoveFinishedTalkArgs = ObjectType<typeof validators.removeFinishedTalkArgs>;
export type RemoveFinishedTalkReturns = Infer<typeof validators.removeFinishedTalkReturns>;
export type UpdatePasswordArgs = ObjectType<typeof validators.updatePasswordArgs>;
export type UpdatePasswordReturns = Infer<typeof validators.updatePasswordReturns>;
