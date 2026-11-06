import { mutations, queries } from './model/talkFeatures';

export {
  backfillStudies,
  estimateStudyBackfill,
} from './model/talkFeatures/study/backfill';
export { generateStudy } from './model/talkFeatures/study/generate';

export const { getTalkFeature } = queries;
export const { saveTalkFeatureDraft, updateTalkFeature } = mutations;
