import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const MODEL_ROOT = path.join(import.meta.dirname);

const STANDARD_TOP_LEVEL = new Set([
  'helpers.ts',
  'index.ts',
  'mutations.ts',
  'queries.ts',
  'schema.ts',
  'test.factory.ts',
  'types.ts',
  'validators.ts',
]);

const STANDARD_BASES = new Set([
  'helpers',
  'index',
  'mutations',
  'queries',
  'schema',
  'test.factory',
  'types',
  'validators',
]);

const DOMAIN_FILE_ALLOWLIST: Record<string, Record<string, string>> = {
  auth: {
    'rateLimiter.ts':
      'Registered Convex functions; moving would rename public/internal API paths.',
  },
  talks: {
    'summaryGenerate.ts':
      'Registered Convex functions; moving would rename public/internal API paths.',
    'transcriptFetch.ts':
      'Registered Convex functions; moving would rename public/internal API paths.',
  },
};

function isStandardTopLevelFile(name: string) {
  if (STANDARD_TOP_LEVEL.has(name)) {
    return true;
  }

  if (!name.endsWith('.test.ts')) {
    return false;
  }

  const base = name.slice(0, -'.test.ts'.length);

  return STANDARD_BASES.has(base);
}

function listDomainDirectories() {
  return readdirSync(MODEL_ROOT).filter((entry) => {
    if (entry.startsWith('.')) {
      return false;
    }

    return statSync(path.join(MODEL_ROOT, entry)).isDirectory();
  });
}

describe('convex model domain structure', () => {
  it('keeps each domain folder to standard top-level files', () => {
    const violations: string[] = [];

    for (const domain of listDomainDirectories()) {
      const domainPath = path.join(MODEL_ROOT, domain);
      const allowlist = DOMAIN_FILE_ALLOWLIST[domain] ?? {};

      for (const entry of readdirSync(domainPath)) {
        const entryPath = path.join(domainPath, entry);

        if (statSync(entryPath).isDirectory()) {
          continue;
        }

        if (isStandardTopLevelFile(entry)) {
          continue;
        }

        if (entry in allowlist) {
          continue;
        }

        violations.push(
          `${domain}/${entry} is not a standard convex/model file. Put feature-specific code in a subfolder (see AGENTS.md Convex file structure).`
        );
      }
    }

    expect(violations).toEqual([]);
  });
});
