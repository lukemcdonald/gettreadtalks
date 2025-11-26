import type { TableNames } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { doc as convexDoc } from 'convex-helpers/validators';

import schema from '../../schema';

/**
 * Creates a document validator that includes system fields for the specified table.
 * @param tableName - The table name
 * @example
 * doc('talks')
 * doc('talks').nullable()
 */
export function doc<T extends TableNames>(tableName: T) {
  const docValidator = convexDoc(schema, tableName);

  return Object.assign(docValidator, {
    nullable: () => v.nullable(docValidator),
  });
}

/**
 * Creates a validator for an array of documents.
 * @param tableName - The table name
 */
export function docs<T extends TableNames>(tableName: T) {
  return v.array(convexDoc(schema, tableName));
}
