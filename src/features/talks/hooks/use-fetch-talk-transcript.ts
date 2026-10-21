import type { UseMutationOptions } from '@/hooks/use-mutation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useFetchTalkTranscript(options?: UseMutationOptions) {
  return useMutation(api.talks.createTalkTranscriptFetch, options);
}
