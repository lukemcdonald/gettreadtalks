import type { ComponentProps } from 'react';

import { Link } from './link';

function FauxLink({
  children,
  prefetch = 'intent',
  ...delegated
}: ComponentProps<typeof Link>) {
  return (
    <Link {...delegated} prefetch={prefetch}>
      <span className="absolute inset-0" />
      {children}
    </Link>
  );
}

export { FauxLink };
