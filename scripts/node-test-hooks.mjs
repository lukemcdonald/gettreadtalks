import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

function resolveTsFile(absolutePath) {
  const asFile = `${absolutePath}.ts`;
  if (existsSync(asFile)) {
    return asFile;
  }

  const asIndex = path.join(absolutePath, 'index.ts');
  if (existsSync(asIndex)) {
    return asIndex;
  }

  return null;
}

function mapAlias(specifier) {
  if (!specifier.startsWith('@/')) {
    return null;
  }

  return resolveTsFile(path.join(repoRoot, 'src', specifier.slice(2)));
}

function mapRelative(specifier, parentURL) {
  if (!parentURL || path.extname(specifier)) {
    return null;
  }

  if (!specifier.startsWith('.')) {
    return null;
  }

  return resolveTsFile(
    path.join(path.dirname(fileURLToPath(parentURL)), specifier)
  );
}

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'server-only') {
    return {
      format: 'module',
      shortCircuit: true,
      url: 'data:text/javascript,export default undefined',
    };
  }

  const mapped =
    mapAlias(specifier) ?? mapRelative(specifier, context.parentURL);
  if (mapped) {
    return nextResolve(pathToFileURL(mapped).href, context);
  }

  return nextResolve(specifier, context);
}
