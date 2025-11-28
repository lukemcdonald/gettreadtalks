import type { Id } from '../_generated/dataModel';

/**
 * ID mapping storage for Airtable record IDs to Convex document IDs.
 * Used during migration to resolve foreign key references.
 */
export type IdMapping = {
  clips: Map<string, Id<'clips'>>;
  collections: Map<string, Id<'collections'>>;
  speakers: Map<string, Id<'speakers'>>;
  talks: Map<string, Id<'talks'>>;
  topics: Map<string, Id<'topics'>>;
};

/**
 * Create a new empty ID mapping.
 */
export function createIdMapping(): IdMapping {
  return {
    clips: new Map(),
    collections: new Map(),
    speakers: new Map(),
    talks: new Map(),
    topics: new Map(),
  };
}
