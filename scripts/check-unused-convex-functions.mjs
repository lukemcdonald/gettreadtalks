#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const AUTH_FUNCTIONS_ASSIGNMENT =
  /authFunctions(?:\s*:\s*\w+)?\s*=\s*internal\.auth\b/u;
const AUTH_TRIGGER_NAMES = ['onCreate', 'onDelete', 'onUpdate'];
const REFERENCE = /(?:api|internal)(?:\.[A-Za-z_]\w*)+\.[A-Za-z_]\w*/gu;
const REGISTRATION =
  /export\s+const\s+(?<name>\w+)\s*=\s*(?:internal)?(?:query|mutation|action)\s*[({]/gu;
const SKIP_DIR_NAMES = new Set([
  '.git',
  '.next',
  '.pnpm-store',
  '_generated',
  'coverage',
  'dist',
  'node_modules',
]);
const SOURCE_EXTENSIONS = new Set([
  '.cjs',
  '.js',
  '.mjs',
  '.sh',
  '.ts',
  '.tsx',
]);
const TRIGGER_REGISTRATION =
  /export\s+const\s*\{(?<names>[^}]+)\}\s*=\s*authComponent\.triggersApi\s*\(\s*\)/gu;

function isGeneratedPath(relativePath) {
  return relativePath.split(path.sep).includes('_generated');
}

function isTestPath(relativePath) {
  return (
    /(?:^|\/)e2e\//u.test(relativePath) ||
    /\.spec\.[cm]?[jt]sx?$/u.test(relativePath) ||
    /\.test\.[cm]?[jt]sx?$/u.test(relativePath)
  );
}

function stripComments(source, filename) {
  if (filename.endsWith('.sh')) {
    return source.replaceAll(/^\s*#.*$/gmu, '');
  }

  const withoutBlock = source.replaceAll(/\/\*[\s\S]*?\*\//gu, '');

  return withoutBlock.replaceAll(/(?<prefix>^|[^:'"`])\/\/.*$/gmu, '$<prefix>');
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      if (SKIP_DIR_NAMES.has(entry.name)) {
        return [];
      }

      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name.startsWith('.')) {
          return [];
        }

        return await listFiles(fullPath);
      }

      if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
        return [fullPath];
      }

      return [];
    })
  );

  return nested.flat();
}

function listRegistrations(source, relativePath) {
  const registrations = [];
  const stripped = stripComments(source, relativePath);

  for (const match of stripped.matchAll(REGISTRATION)) {
    registrations.push({
      file: relativePath,
      name: match.groups?.name,
    });
  }

  for (const match of stripped.matchAll(TRIGGER_REGISTRATION)) {
    const names = (match.groups?.names ?? '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

    for (const name of names) {
      registrations.push({
        file: relativePath,
        name,
      });
    }
  }

  return registrations;
}

function listReferencedNames(source, filename) {
  const names = new Set();
  const stripped = stripComments(source, filename);

  for (const match of stripped.matchAll(REFERENCE)) {
    const parts = match[0].split('.');
    names.add(parts.at(-1));
  }

  if (AUTH_FUNCTIONS_ASSIGNMENT.test(stripped)) {
    for (const name of AUTH_TRIGGER_NAMES) {
      names.add(name);
    }
  }

  return names;
}

function collectFromSource(relativePath, source, referenced, registrations) {
  if (
    relativePath.startsWith(`convex${path.sep}`) &&
    relativePath.endsWith('.ts')
  ) {
    registrations.push(...listRegistrations(source, relativePath));
  }

  for (const name of listReferencedNames(source, relativePath)) {
    referenced.add(name);
  }
}

async function main() {
  const files = await listFiles(ROOT);
  const referenced = new Set();
  const registrations = [];
  const sources = await Promise.all(
    files.map(async (file) => {
      const relativePath = path.relative(ROOT, file);

      if (isGeneratedPath(relativePath) || isTestPath(relativePath)) {
        return null;
      }

      return {
        relativePath,
        source: await readFile(file, 'utf-8'),
      };
    })
  );

  for (const entry of sources) {
    if (!entry) {
      continue;
    }

    collectFromSource(
      entry.relativePath,
      entry.source,
      referenced,
      registrations
    );
  }

  const unused = registrations
    .filter((registration) => !referenced.has(registration.name))
    .toSorted((left, right) => {
      if (left.name === right.name) {
        return left.file.localeCompare(right.file);
      }

      return left.name.localeCompare(right.name);
    });

  if (unused.length === 0) {
    console.log('All registered Convex functions have an api/internal caller.');
    return;
  }

  console.error('Unused registered Convex functions:');

  for (const registration of unused) {
    console.error(`  ${registration.name} (${registration.file})`);
  }

  process.exitCode = 1;
}

await main();
