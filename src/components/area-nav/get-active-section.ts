import type { AreaNavSection } from './area-nav';

import { isManagePath } from './sections';

function itemMatches(href: string, pathname: string) {
  if (href === pathname) {
    return true;
  }

  return pathname.startsWith(`${href}/`);
}

export function getActiveSection(sections: AreaNavSection[], pathname: string) {
  let match: AreaNavSection | undefined;
  let matchLength = -1;

  for (const section of sections) {
    for (const item of section.items) {
      if (!itemMatches(item.href, pathname)) {
        continue;
      }

      if (item.href.length <= matchLength) {
        continue;
      }

      match = section;
      matchLength = item.href.length;
    }
  }

  const [fallback] = sections;

  if (!fallback) {
    throw new Error('Area layout requires at least one section');
  }

  if (!match && isManagePath(pathname)) {
    return sections.find((section) => isManagePath(section.href)) ?? fallback;
  }

  return match ?? fallback;
}
