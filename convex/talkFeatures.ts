import { mutations, queries } from './model/talkFeatures';

export { generateStudy } from './model/talkFeatures/study/generate';

export const { getTalkFeature, loadTalkFeature } = queries;
export const { saveTalkFeatureDraft, updateTalkFeature } = mutations;
