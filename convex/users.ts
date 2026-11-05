import { mutations, queries } from './model/users';

// Queries
export const {
  getCurrentUser,
  isSpeakerFavorited,
  isTalkFavorited,
  isTalkFinished,
  listUserFavorites,
  listUserFinishedTalks,
} = queries;

// Mutations
export const {
  deleteUser,
  favoriteSpeaker,
  favoriteTalk,
  finishTalk,
  unfavoriteClip,
  unfavoriteSpeaker,
  unfavoriteTalk,
  unfinishTalk,
  updateUserEmail,
  updateUserPassword,
  updateUserProfile,
} = mutations;
