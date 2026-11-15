import { createApi } from '@convex-dev/better-auth';

import { createAuthOptions } from '../auth';
import schema from './schema';

export const {
  consumeOne,
  create,
  deleteMany,
  deleteOne,
  findMany,
  findOne,
  incrementOne,
  updateMany,
  updateOne,
} = createApi(schema, createAuthOptions);
