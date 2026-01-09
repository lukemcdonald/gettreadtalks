import { doc } from './schema';

// Validators for enriched documents with relations (e.g., talks with speakers).
// Separate from schema validators to avoid circular dependencies during schema initialization.
export const talkWithSpeakerValidator = doc('talks').extend({
  speaker: doc('speakers').nullable(),
});
