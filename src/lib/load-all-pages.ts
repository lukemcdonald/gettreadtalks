interface PageResult<T> {
  continueCursor: string;
  isDone: boolean;
  page: T[];
}

const MAX_PAGE_READS = 50;

export async function loadAllPages<T>(
  loadPage: (cursor: string | null) => Promise<PageResult<T>>
) {
  const page: T[] = [];
  let cursor: string | null = null;
  let isDone = false;
  let continueCursor = '';

  for (let read = 0; !isDone && read < MAX_PAGE_READS; read += 1) {
    // oxlint-disable-next-line no-await-in-loop -- the next cursor depends on this page
    const result = await loadPage(cursor);
    const {
      continueCursor: nextCursor,
      isDone: pageDone,
      page: sourcePage,
    } = result;

    page.push(...sourcePage);
    continueCursor = nextCursor;
    isDone = pageDone;

    if (sourcePage.length === 0 && (pageDone || nextCursor === cursor)) {
      break;
    }

    cursor = nextCursor;
  }

  return {
    continueCursor,
    isDone,
    page,
  };
}
