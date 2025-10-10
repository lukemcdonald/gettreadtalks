import { mutation, query } from './_generated/server';
import { mutations, queries, validators } from './model/clips';

// ============================================
// QUERIES
// ============================================

export const getBySlug = query({
  args: validators.getClipBySlugWithRelationsArgs,
  handler: async (ctx, args) => {
    return await queries.getBySlugWithRelations(ctx, args);
  },
  returns: validators.getClipBySlugWithRelationsReturns,
});

export const getBySpeaker = query({
  args: validators.getClipsBySpeakerArgs,
  handler: async (ctx, args) => {
    return await queries.getClipsBySpeaker(ctx, args);
  },
  returns: validators.getClipsBySpeakerReturns,
});

export const list = query({
  args: validators.listClipsArgs,
  handler: async (ctx, args) => {
    return await queries.getClips(ctx, args);
  },
  returns: validators.listClipsReturns,
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: validators.createClipArgs,
  handler: async (ctx, args) => {
    return await mutations.createClip(ctx, args);
  },
  returns: validators.createClipReturns,
});

export const deleteClip = mutation({
  args: validators.deleteClipArgs,
  handler: async (ctx, args) => {
    return await mutations.deleteClip(ctx, args);
  },
  returns: validators.deleteClipReturns,
});

export const update = mutation({
  args: validators.updateClipArgs,
  handler: async (ctx, args) => {
    return await mutations.updateClip(ctx, args);
  },
  returns: validators.updateClipReturns,
});

export const updateStatus = mutation({
  args: validators.updateClipStatusArgs,
  handler: async (ctx, args) => {
    return await mutations.updateClipStatus(ctx, args);
  },
  returns: validators.updateClipStatusReturns,
});
