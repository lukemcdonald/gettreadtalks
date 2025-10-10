import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type AddFavoriteClipArgs = ObjectType<typeof validators.addFavoriteClipArgs>;
export type AddFavoriteClipReturns = Infer<typeof validators.addFavoriteClipReturns>;
export type AddFavoriteSpeakerArgs = ObjectType<typeof validators.addFavoriteSpeakerArgs>;
export type AddFavoriteSpeakerReturns = Infer<typeof validators.addFavoriteSpeakerReturns>;
export type AddFavoriteTalkArgs = ObjectType<typeof validators.addFavoriteTalkArgs>;
export type AddFavoriteTalkReturns = Infer<typeof validators.addFavoriteTalkReturns>;
export type ListUserFavoritesArgs = ObjectType<typeof validators.listUserFavoritesArgs>;
export type ListUserFavoritesReturns = Infer<typeof validators.listUserFavoritesReturns>;
export type RemoveFavoriteClipArgs = ObjectType<typeof validators.removeFavoriteClipArgs>;
export type RemoveFavoriteClipReturns = Infer<typeof validators.removeFavoriteClipReturns>;
export type RemoveFavoriteSpeakerArgs = ObjectType<typeof validators.removeFavoriteSpeakerArgs>;
export type RemoveFavoriteSpeakerReturns = Infer<typeof validators.removeFavoriteSpeakerReturns>;
export type RemoveFavoriteTalkArgs = ObjectType<typeof validators.removeFavoriteTalkArgs>;
export type RemoveFavoriteTalkReturns = Infer<typeof validators.removeFavoriteTalkReturns>;
export type UpdatePasswordArgs = ObjectType<typeof validators.updatePasswordArgs>;
export type UpdatePasswordReturns = Infer<typeof validators.updatePasswordReturns>;
