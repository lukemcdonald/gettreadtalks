import type { AreaNavSection, AreaNavSections } from './area-nav';

function itemMatches(href: string, pathname: string) {
  if (href === pathname) {
    return true;
  }

  return pathname.startsWith(`${href}/`);
}

export function getActiveSection(sections: AreaNavSections, pathname: string) {
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

  return match ?? sections[0];
}
