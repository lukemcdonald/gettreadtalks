'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

import { toastManager } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import {
  buildTalkStudyPath,
  getTranscriptFetchToast,
} from '@/features/talks/utils';
import { useIsAdmin } from '@/features/users/hooks/use-is-admin';

interface WatchedTranscriptFetch {
  runId: string;
  talkId: TalkId;
}

const EMPTY_WATCHES: WatchedTranscriptFetch[] = [];
const listeners = new Set<() => void>();
const toastedRunIds = new Set<string>();
let watches: WatchedTranscriptFetch[] = EMPTY_WATCHES;

function emitWatchedTranscriptFetches() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeWatchedTranscriptFetches(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function watchTranscriptFetch(watch: WatchedTranscriptFetch) {
  watches = [...watches.filter((item) => item.talkId !== watch.talkId), watch];
  emitWatchedTranscriptFetches();
}

function unwatchTranscriptFetch(talkId: TalkId) {
  watches = watches.filter((item) => item.talkId !== talkId);

  if (watches.length === 0) {
    watches = EMPTY_WATCHES;
  }

  emitWatchedTranscriptFetches();
}

function useWatchedTranscriptFetches() {
  return useSyncExternalStore(
    subscribeWatchedTranscriptFetches,
    () => watches,
    () => EMPTY_WATCHES
  );
}

function TranscriptFetchToast({ runId, talkId }: WatchedTranscriptFetch) {
  const fetch = useQuery(api.talks.getTalkTranscriptFetch, { talkId });
  const pathname = usePathname();
  const router = useRouter();
  const studyPath = buildTalkStudyPath(talkId);

  useEffect(() => {
    const toast = getTranscriptFetchToast({
      fetch: fetch ?? null,
      toastedRunIds,
      watchedRunId: runId,
    });

    if (!toast) {
      return;
    }

    toastedRunIds.add(runId);

    if (pathname !== studyPath) {
      toastManager.add({
        actionProps: {
          children: 'Open',
          onClick() {
            router.push(studyPath);
          },
        },
        title: toast.title,
        type: toast.type,
      });
    }

    unwatchTranscriptFetch(talkId);
  }, [fetch, pathname, router, runId, studyPath, talkId]);

  return null;
}

export function TranscriptFetchToasts() {
  const isAdmin = useIsAdmin();
  const watched = useWatchedTranscriptFetches();

  if (!isAdmin) {
    return null;
  }

  return watched.map((watch) => (
    <TranscriptFetchToast
      key={watch.runId}
      runId={watch.runId}
      talkId={watch.talkId}
    />
  ));
}
