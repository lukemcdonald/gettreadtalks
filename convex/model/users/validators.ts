import { v } from 'convex/values';

// ============================================
// FAVORITES
// ============================================

export const addFavoriteClipArgs = {
  clipId: v.id('clips'),
};

export const addFavoriteClipReturns = v.id('userFavoriteClips');

export const addFavoriteSpeakerArgs = {
  speakerId: v.id('speakers'),
};

export const addFavoriteSpeakerReturns = v.id('userFavoriteSpeakers');

export const addFavoriteTalkArgs = {
  talkId: v.id('talks'),
};

export const addFavoriteTalkReturns = v.id('userFavoriteTalks');

export const listUserFavoritesArgs = {
  limit: v.optional(v.number()),
};

export const listUserFavoritesReturns = v.object({
  clips: v.array(
    v.object({
      clipId: v.id('clips'),
      userId: v.string(),
    }),
  ),
  speakers: v.array(
    v.object({
      speakerId: v.id('speakers'),
      userId: v.string(),
    }),
  ),
  talks: v.array(
    v.object({
      talkId: v.id('talks'),
      userId: v.string(),
    }),
  ),
});

export const removeFavoriteClipArgs = {
  clipId: v.id('clips'),
};

export const removeFavoriteClipReturns = v.null();

export const removeFavoriteSpeakerArgs = {
  speakerId: v.id('speakers'),
};

export const removeFavoriteSpeakerReturns = v.null();

export const removeFavoriteTalkArgs = {
  talkId: v.id('talks'),
};

export const removeFavoriteTalkReturns = v.null();

// ============================================
// PASSWORD
// ============================================

export const updatePasswordArgs = {
  currentPassword: v.string(),
  newPassword: v.string(),
};

export const updatePasswordReturns = v.null();
