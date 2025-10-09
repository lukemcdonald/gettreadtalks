import type { Infer, ObjectType } from 'convex/values';

import * as validators from './validators';

export type UpdatePasswordArgs = ObjectType<typeof validators.updatePasswordArgs>;
export type UpdatePasswordReturns = Infer<typeof validators.updatePasswordReturns>;
