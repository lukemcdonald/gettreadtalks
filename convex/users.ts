import { mutations, queries } from './model/users';

// Queries
export const getCurrentUser = queries.getCurrentUser;
export const isClipFavorited = queries.isClipFavorited;
export const isSpeakerFavorited = queries.isSpeakerFavorited;
export const isTalkFavorited = queries.isTalkFavorited;
export const isTalkFinished = queries.isTalkFinished;
export const listUserFavorites = queries.listUserFavorites;
export const listUserFinishedTalks = queries.listUserFinishedTalks;

// Mutations
export const favoriteClip = mutations.favoriteClip;
export const favoriteSpeaker = mutations.favoriteSpeaker;
export const favoriteTalk = mutations.favoriteTalk;
export const finishTalk = mutations.finishTalk;
export const unfavoriteClip = mutations.unfavoriteClip;
export const unfavoriteSpeaker = mutations.unfavoriteSpeaker;
export const unfavoriteTalk = mutations.unfavoriteTalk;
export const unfinishTalk = mutations.unfinishTalk;
export const updatePassword = mutations.updatePassword;
