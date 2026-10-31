interface AreaNavActiveItem {
  children?: AreaNavActiveItem[];
  href: string;
}

export function isAreaNavItemActive(
  item: AreaNavActiveItem,
  pathname: string
): boolean {
  return (
    item.href === pathname ||
    (item.children ?? []).some((child) => isAreaNavItemActive(child, pathname))
  );
}
