export function getRel(target?: string, rel?: string) {
  if (target === '_blank') {
    return rel ?? 'noopener noreferrer';
  }

  return rel;
}
