interface AreaNavActiveItem {
  children?: AreaNavActiveItem[];
  href: string;
}

export function isAreaNavItemActive(item: AreaNavActiveItem, pathname: string) {
  if (item.href === pathname) {
    return true;
  }

  for (const child of item.children ?? []) {
    if (isAreaNavItemActive(child, pathname)) {
      return true;
    }
  }

  return false;
}
