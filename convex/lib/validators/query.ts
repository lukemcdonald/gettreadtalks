import { doc } from './schema';

// Validators for enriched documents (with related entities)
// These depend on doc() which requires the schema to be fully initialized,
// so they must be in a separate file that's not imported by schema files.
export const talkWithSpeakerValidator = doc('talks').extend({
  speaker: doc('speakers').nullable(),
});
