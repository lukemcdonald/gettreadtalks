import { v } from 'convex/values';

import { docs } from '../../lib/validators/schema';

// ============================================
// FAVORITES
// ============================================

export const favoriteClipArgs = {
  clipId: v.id('clips'),
};

export const favoriteClipReturns = v.id('userFavoriteClips');

export const favoriteSpeakerArgs = {
  speakerId: v.id('speakers'),
};

export const favoriteSpeakerReturns = v.id('userFavoriteSpeakers');

export const favoriteTalkArgs = {
  talkId: v.id('talks'),
};

export const favoriteTalkReturns = v.id('userFavoriteTalks');

export const listUserFavoritesArgs = {
  limit: v.optional(v.number()),
};

export const listUserFavoritesReturns = v.object({
  clips: docs('userFavoriteClips'),
  speakers: docs('userFavoriteSpeakers'),
  talks: docs('userFavoriteTalks'),
});

export const unfavoriteClipArgs = {
  clipId: v.id('clips'),
};

export const unfavoriteClipReturns = v.null();

export const unfavoriteSpeakerArgs = {
  speakerId: v.id('speakers'),
};

export const unfavoriteSpeakerReturns = v.null();

export const unfavoriteTalkArgs = {
  talkId: v.id('talks'),
};

export const unfavoriteTalkReturns = v.null();

// ============================================
// FINISHED TALKS
// ============================================

export const finishTalkArgs = {
  talkId: v.id('talks'),
};

export const finishTalkReturns = v.id('userFinishedTalks');

export const listUserFinishedTalksArgs = {
  limit: v.optional(v.number()),
};

export const listUserFinishedTalksReturns = docs('userFinishedTalks');

export const unfinishTalkArgs = {
  talkId: v.id('talks'),
};

export const unfinishTalkReturns = v.null();

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
// PASSWORD
// ============================================

export const updatePasswordArgs = {
  currentPassword: v.string(),
  newPassword: v.string(),
};

export const updatePasswordReturns = v.null();
