import type { ObjectType } from 'convex/values';

import * as validators from './validators';

export type UpdatePasswordArgs = ObjectType<typeof validators.updatePasswordArgs>;
