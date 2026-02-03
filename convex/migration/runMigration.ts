import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { createIdMapping } from './idMap';
import { importAffiliateLinks } from './importAffiliateLinks';
import { importClips } from './importClips';
import { importCollections } from './importCollections';
import { importTalksOnTopics } from './importJoinTables';
import { importSpeakers } from './importSpeakers';
import { importTalks } from './importTalks';
import { importTopics } from './importTopics';

/**
 * Clear all data from tables (for development/testing).
 * WARNING: This permanently deletes all data!
 * Only works in non-production deployments.
 */
export const clearAllData = mutation({
  args: {},
  returns: v.object({
    deleted: v.record(v.string(), v.number()),
  }),
  handler: async (ctx) => {
    if (process.env.CONVEX_CLOUD_URL?.includes('prod.convex.cloud')) {
      throw new Error('Migration functions are disabled in production');
    }
    // Delete in reverse dependency order
    const tables = [
      'talksOnTopics',
      'userFavoriteClips',
      'userFavoriteSpeakers',
      'userFavoriteTalks',
      'userFinishedTalks',
      'clips',
      'talks',
      'affiliateLinks',
      'collections',
      'topics',
      'speakers',
    ];

    const deleted: Record<string, number> = {};

    for (const table of tables) {
      // Type assertion needed because table names are dynamic at runtime
      // biome-ignore lint/suspicious/noExplicitAny: migration
      const records = await ctx.db.query(table as any).collect();
      deleted[table] = records.length;

      for (const record of records) {
        await ctx.db.delete(record._id);
      }

      console.log(`Deleted ${records.length} records from ${table}`);
    }

    return { deleted };
  },
});

/**
 * Main migration mutation that orchestrates the entire migration process.
 * This is called from a local script that fetches Airtable data first.
 * Only works in non-production deployments.
 */
export const runMigration = mutation({
  args: {
    affiliateLinks: v.array(v.any()),
    clips: v.array(v.any()),
    series: v.array(v.any()),
    speakers: v.array(v.any()),
    talks: v.array(v.any()),
    topics: v.array(v.any()),
  },
  returns: v.object({
    affiliateLinks: v.number(),
    clips: v.number(),
    collections: v.number(),
    speakers: v.number(),
    talks: v.number(),
    topics: v.number(),
  }),
  handler: async (ctx, args) => {
    if (process.env.CONVEX_CLOUD_URL?.includes('prod.convex.cloud')) {
      throw new Error('Migration functions are disabled in production');
    }
    console.log('Starting Airtable to Convex migration...');
    console.log(
      `Importing ${args.speakers.length} speakers, ${args.topics.length} topics, ${args.series.length} series, ${args.talks.length} talks, ${args.clips.length} clips, ${args.affiliateLinks.length} affiliate links`,
    );

    const idMapping = createIdMapping();

    // Import in dependency order
    console.log('Importing speakers...');
    await importSpeakers(ctx, args.speakers, idMapping);

    console.log('Importing topics...');
    await importTopics(ctx, args.topics, idMapping);

    console.log('Importing collections...');
    await importCollections(ctx, args.series, idMapping);

    console.log('Importing talks...');
    await importTalks(ctx, args.talks, idMapping);

    console.log('Importing clips...');
    await importClips(ctx, args.clips, idMapping);

    console.log('Importing affiliate links...');
    await importAffiliateLinks(ctx, args.affiliateLinks);

    console.log('Importing join tables...');
    await importTalksOnTopics(ctx, args.talks, idMapping);

    console.log('Migration completed successfully!');

    return {
      affiliateLinks: args.affiliateLinks.length,
      clips: args.clips.length,
      collections: args.series.length,
      speakers: args.speakers.length,
      talks: args.talks.length,
      topics: args.topics.length,
    };
  },
});
