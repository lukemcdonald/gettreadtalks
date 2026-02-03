import type { Id } from '../_generated/dataModel';
import type { IdMapping } from './idMap';

import { v } from 'convex/values';

import { internalMutation } from '../_generated/server';
import { importAffiliateLinks } from './importAffiliateLinks';
import { importClips } from './importClips';
import { importCollections } from './importCollections';
import { importTalksOnTopics } from './importJoinTables';
import { importSpeakers } from './importSpeakers';
import { importTalks } from './importTalks';
import { importTopics } from './importTopics';

/**
 * Internal mutation to import speakers in batch.
 */
export const importSpeakersBatch = internalMutation({
  args: {
    idMapping: v.any(),
    records: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const idMapping = deserializeIdMapping(args.idMapping);
    const result = await importSpeakers(ctx, args.records, idMapping);

    return {
      idMapping: serializeIdMapping(idMapping),
      result,
    };
  },
});

/**
 * Internal mutation to import topics in batch.
 */
export const importTopicsBatch = internalMutation({
  args: {
    idMapping: v.any(),
    records: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const idMapping = deserializeIdMapping(args.idMapping);
    const result = await importTopics(ctx, args.records, idMapping);

    return {
      idMapping: serializeIdMapping(idMapping),
      result,
    };
  },
});

/**
 * Internal mutation to import collections in batch.
 */
export const importCollectionsBatch = internalMutation({
  args: {
    idMapping: v.any(),
    records: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const idMapping = deserializeIdMapping(args.idMapping);
    const result = await importCollections(ctx, args.records, idMapping);

    return {
      idMapping: serializeIdMapping(idMapping),
      result,
    };
  },
});

/**
 * Internal mutation to import talks in batch.
 */
export const importTalksBatch = internalMutation({
  args: {
    idMapping: v.any(),
    records: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const idMapping = deserializeIdMapping(args.idMapping);
    const result = await importTalks(ctx, args.records, idMapping);

    return {
      idMapping: serializeIdMapping(idMapping),
      result,
    };
  },
});

/**
 * Internal mutation to import clips in batch.
 */
export const importClipsBatch = internalMutation({
  args: {
    idMapping: v.any(),
    records: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const idMapping = deserializeIdMapping(args.idMapping);
    const result = await importClips(ctx, args.records, idMapping);

    return {
      idMapping: serializeIdMapping(idMapping),
      result,
    };
  },
});

/**
 * Internal mutation to import affiliate links in batch.
 */
export const importAffiliateLinksBatch = internalMutation({
  args: {
    records: v.array(v.any()),
  },
  handler: async (ctx, args) => await importAffiliateLinks(ctx, args.records),
});

/**
 * Internal mutation to import talksOnTopics join table.
 */
export const importTalksOnTopicsBatch = internalMutation({
  args: {
    idMapping: v.any(),
    records: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const idMapping = deserializeIdMapping(args.idMapping);
    return await importTalksOnTopics(ctx, args.records, idMapping);
  },
});

/**
 * Helper to serialize ID mapping for passing between actions/mutations.
 */
function serializeIdMapping(mapping: IdMapping): Record<string, Record<string, string>> {
  return {
    clips: Object.fromEntries(mapping.clips),
    collections: Object.fromEntries(mapping.collections),
    speakers: Object.fromEntries(mapping.speakers),
    talks: Object.fromEntries(mapping.talks),
    topics: Object.fromEntries(mapping.topics),
  };
}

/**
 * Helper to deserialize ID mapping.
 */
function deserializeIdMapping(serialized: Record<string, Record<string, string>>): IdMapping {
  return {
    clips: new Map(Object.entries(serialized.clips || {})) as Map<string, Id<'clips'>>,
    collections: new Map(Object.entries(serialized.collections || {})) as Map<
      string,
      Id<'collections'>
    >,
    speakers: new Map(Object.entries(serialized.speakers || {})) as Map<string, Id<'speakers'>>,
    talks: new Map(Object.entries(serialized.talks || {})) as Map<string, Id<'talks'>>,
    topics: new Map(Object.entries(serialized.topics || {})) as Map<string, Id<'topics'>>,
  };
}
