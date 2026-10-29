import { mutations, queries } from './model/talkFeatures';

export { generateStudy } from './model/talkFeatures/studyGenerate';

export const { get } = queries;
export const { saveDraft, update } = mutations;
