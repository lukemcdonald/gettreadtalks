import type { TableNames } from '../../_generated/dataModel';

import { v } from 'convex/values';
import { doc as convexDoc } from 'convex-helpers/validators';

import schema from '../../schema';

/**
 * Type-safe document validator with system fields (_id, _creationTime).
 *
 * @example
 * returns: doc('talks')
 * returns: doc('talks').nullable()
 * returns: v.array(doc('talks'))
 */
export function doc<T extends TableNames>(tableName: T) {
  const docValidator = convexDoc(schema, tableName);

  return Object.assign(docValidator, {
    nullable: () => v.nullable(docValidator),
  });
}

/**
 * Type-safe validator for arrays of documents.
 *
 * @example
 * returns: docs('talks')
 */
export function docs<T extends TableNames>(tableName: T) {
  return v.array(convexDoc(schema, tableName));
}
