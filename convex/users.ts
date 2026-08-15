import { mutations, queries } from './model/users';

// Queries
export const {
  getCurrentUser,
  isClipFavorited,
  isSpeakerFavorited,
  isTalkFavorited,
  isTalkFinished,
  listUserFavorites,
  listUserFinishedTalks,
} = queries;

// Mutations
export const {
  deleteUser,
  favoriteClip,
  favoriteSpeaker,
  favoriteTalk,
  finishTalk,
  setUserRole,
  unfavoriteClip,
  unfavoriteSpeaker,
  unfavoriteTalk,
  unfinishTalk,
  updateUserEmail,
  updateUserPassword,
  updateUserProfile,
} = mutations;
