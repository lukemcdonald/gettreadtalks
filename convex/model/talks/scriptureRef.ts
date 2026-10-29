export interface ScriptureRef {
  osis: string | null;
  text: string;
}

interface KeyPassageLike {
  reference: ScriptureRef;
}

interface ParsedRange {
  chapter: number;
  endVerse?: number;
  verse?: number;
}

interface TalkStudyMainPointInput {
  body: string;
  heading: string;
  references: { text: string }[];
}

interface TalkStudyKeyPassageInput {
  note: string;
  reference: { text: string };
}

const BOOK_ALIASES: [string, string][] = [
  ['song of solomon', 'Song'],
  ['song of songs', 'Song'],
  ['1 thessalonians', '1Thess'],
  ['2 thessalonians', '2Thess'],
  ['1 corinthians', '1Cor'],
  ['2 corinthians', '2Cor'],
  ['1 chronicles', '1Chr'],
  ['2 chronicles', '2Chr'],
  ['ecclesiastes', 'Eccl'],
  ['lamentations', 'Lam'],
  ['deuteronomy', 'Deut'],
  ['zephaniah', 'Zeph'],
  ['zechariah', 'Zech'],
  ['philippians', 'Phil'],
  ['revelation', 'Rev'],
  ['leviticus', 'Lev'],
  ['habakkuk', 'Hab'],
  ['obadiah', 'Obad'],
  ['malachi', 'Mal'],
  ['matthew', 'Matt'],
  ['genesis', 'Gen'],
  ['exodus', 'Exod'],
  ['numbers', 'Num'],
  ['joshua', 'Josh'],
  ['judges', 'Judg'],
  ['1 samuel', '1Sam'],
  ['2 samuel', '2Sam'],
  ['1 kings', '1Kgs'],
  ['2 kings', '2Kgs'],
  ['nehemiah', 'Neh'],
  ['esther', 'Esth'],
  ['proverbs', 'Prov'],
  ['isaiah', 'Isa'],
  ['jeremiah', 'Jer'],
  ['ezekiel', 'Ezek'],
  ['daniel', 'Dan'],
  ['hosea', 'Hos'],
  ['amos', 'Amos'],
  ['jonah', 'Jonah'],
  ['micah', 'Mic'],
  ['nahum', 'Nah'],
  ['haggai', 'Hag'],
  ['romans', 'Rom'],
  ['galatians', 'Gal'],
  ['ephesians', 'Eph'],
  ['colossians', 'Col'],
  ['1 timothy', '1Tim'],
  ['2 timothy', '2Tim'],
  ['philemon', 'Phlm'],
  ['hebrews', 'Heb'],
  ['1 peter', '1Pet'],
  ['2 peter', '2Pet'],
  ['1 john', '1John'],
  ['2 john', '2John'],
  ['3 john', '3John'],
  ['james', 'Jas'],
  ['jude', 'Jude'],
  ['acts', 'Acts'],
  ['ruth', 'Ruth'],
  ['ezra', 'Ezra'],
  ['job', 'Job'],
  ['joel', 'Joel'],
  ['mark', 'Mark'],
  ['luke', 'Luke'],
  ['john', 'John'],
  ['titus', 'Titus'],
  ['psalms', 'Ps'],
  ['psalm', 'Ps'],
  ['song', 'Song'],
  ['1 thess', '1Thess'],
  ['2 thess', '2Thess'],
  ['1 cor', '1Cor'],
  ['2 cor', '2Cor'],
  ['1 chr', '1Chr'],
  ['2 chr', '2Chr'],
  ['1 sam', '1Sam'],
  ['2 sam', '2Sam'],
  ['1 kgs', '1Kgs'],
  ['2 kgs', '2Kgs'],
  ['1 tim', '1Tim'],
  ['2 tim', '2Tim'],
  ['1 pet', '1Pet'],
  ['2 pet', '2Pet'],
  ['phlm', 'Phlm'],
  ['phil', 'Phil'],
  ['matt', 'Matt'],
  ['rev', 'Rev'],
  ['gen', 'Gen'],
  ['exo', 'Exod'],
  ['exod', 'Exod'],
  ['lev', 'Lev'],
  ['num', 'Num'],
  ['deut', 'Deut'],
  ['josh', 'Josh'],
  ['judg', 'Judg'],
  ['neh', 'Neh'],
  ['esth', 'Esth'],
  ['prov', 'Prov'],
  ['eccl', 'Eccl'],
  ['isa', 'Isa'],
  ['jer', 'Jer'],
  ['lam', 'Lam'],
  ['ezek', 'Ezek'],
  ['dan', 'Dan'],
  ['hos', 'Hos'],
  ['obad', 'Obad'],
  ['mic', 'Mic'],
  ['nah', 'Nah'],
  ['hab', 'Hab'],
  ['zeph', 'Zeph'],
  ['hag', 'Hag'],
  ['zech', 'Zech'],
  ['mal', 'Mal'],
  ['rom', 'Rom'],
  ['gal', 'Gal'],
  ['eph', 'Eph'],
  ['col', 'Col'],
  ['heb', 'Heb'],
  ['jas', 'Jas'],
  ['ps', 'Ps'],
];

const BOOK_ALIASES_BY_LENGTH = BOOK_ALIASES.toSorted(
  (left, right) => right[0].length - left[0].length
);

const RANGE_PATTERN =
  /^(?<chapter>\d+)(?::(?<verse>\d+)(?:\s*-\s*(?<endVerse>\d+))?)?$/u;

function normalizeRefText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll('.', '')
    .replaceAll(/[–—]/gu, '-')
    .replaceAll(/\s+/gu, ' ');
}

function matchBook(normalized: string) {
  for (const [alias, osis] of BOOK_ALIASES_BY_LENGTH) {
    if (normalized === alias || normalized.startsWith(`${alias} `)) {
      return { alias, osis };
    }
  }

  return null;
}

function parseRange(rest: string): ParsedRange | null {
  const groups = RANGE_PATTERN.exec(rest)?.groups;

  if (!groups) {
    return null;
  }

  return {
    chapter: Number(groups.chapter),
    endVerse:
      groups.endVerse === undefined ? undefined : Number(groups.endVerse),
    verse: groups.verse === undefined ? undefined : Number(groups.verse),
  };
}

function toOsis(book: string, range: ParsedRange) {
  if (range.verse === undefined) {
    return `${book}.${range.chapter}`;
  }

  const start = `${book}.${range.chapter}.${range.verse}`;

  if (range.endVerse === undefined) {
    return start;
  }

  return `${start}-${book}.${range.chapter}.${range.endVerse}`;
}

function isSameScriptureRef(left: ScriptureRef, right: ScriptureRef) {
  if (left.osis && right.osis) {
    return left.osis === right.osis;
  }

  return normalizeRefText(left.text) === normalizeRefText(right.text);
}

export function parseScriptureRef(value: string): ScriptureRef {
  const text = value.trim();

  if (!text) {
    return { osis: null, text };
  }

  const normalized = normalizeRefText(text);
  const book = matchBook(normalized);

  if (!book) {
    return { osis: null, text };
  }

  const rest = normalized.slice(book.alias.length).trim();

  if (!rest) {
    return { osis: book.osis, text };
  }

  const range = parseRange(rest);

  if (!range) {
    return { osis: null, text };
  }

  return { osis: toOsis(book.osis, range), text };
}

export function orderKeyPassages<T extends KeyPassageLike>(
  passages: T[],
  mainScripture: string
): T[] {
  if (passages.length < 2 || !mainScripture.trim()) {
    return passages;
  }

  const main = parseScriptureRef(mainScripture);
  const mainIndex = passages.findIndex((passage) =>
    isSameScriptureRef(passage.reference, main)
  );

  if (mainIndex <= 0) {
    return passages;
  }

  const mainPassage = passages[mainIndex];

  if (!mainPassage) {
    return passages;
  }

  return [
    mainPassage,
    ...passages.slice(0, mainIndex),
    ...passages.slice(mainIndex + 1),
  ];
}

export function toTalkStudyMainPoints(points: TalkStudyMainPointInput[]) {
  return points.map((point) => ({
    body: point.body.trim(),
    heading: point.heading.trim(),
    references: point.references.map((ref) => parseScriptureRef(ref.text)),
  }));
}

export function toTalkStudyKeyPassages(passages: TalkStudyKeyPassageInput[]) {
  return passages.map((passage) => ({
    note: passage.note.trim(),
    reference: parseScriptureRef(passage.reference.text),
  }));
}
