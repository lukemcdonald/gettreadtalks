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
// STATUS CHECKS
// ============================================

export const isClipFavoritedArgs = {
  clipId: v.id('clips'),
};

export const isClipFavoritedReturns = v.boolean();

export const isSpeakerFavoritedArgs = {
  speakerId: v.id('speakers'),
};

export const isSpeakerFavoritedReturns = v.boolean();

export const isTalkFavoritedArgs = {
  talkId: v.id('talks'),
};

export const isTalkFavoritedReturns = v.boolean();

export const isTalkFinishedArgs = {
  talkId: v.id('talks'),
};

export const isTalkFinishedReturns = v.boolean();

// ============================================
// FINISHED TALKS
// ============================================

export const addFinishedTalkArgs = {
  talkId: v.id('talks'),
};

export const addFinishedTalkReturns = v.id('userFinishedTalks');

export const listUserFinishedTalksArgs = {
  limit: v.optional(v.number()),
};

export const listUserFinishedTalksReturns = v.array(
  v.object({
    talkId: v.id('talks'),
    userId: v.string(),
  }),
);

export const removeFinishedTalkArgs = {
  talkId: v.id('talks'),
};

export const removeFinishedTalkReturns = v.null();

// ============================================
// PASSWORD
// ============================================

export const updatePasswordArgs = {
  currentPassword: v.string(),
  newPassword: v.string(),
};

export const updatePasswordReturns = v.null();
