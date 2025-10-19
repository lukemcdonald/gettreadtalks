import type { TableNames } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { doc as convexDoc } from 'convex-helpers/validators';

import schema from '../../schema';

/**
 * Creates a document validator that includes system fields for the specified table.
 * @param tableName - The table name
 * @param nullable - Whether the document can be null (default: false)
 */
export function doc<T extends TableNames>(tableName: T, nullable: boolean = false) {
  const docValidator = convexDoc(schema, tableName);
  return nullable ? v.union(docValidator, v.null()) : docValidator;
}

/**
 * Creates a validator for an array of documents.
 * @param tableName - The table name
 */
export function docs<T extends TableNames>(tableName: T) {
  return v.array(convexDoc(schema, tableName));
}

