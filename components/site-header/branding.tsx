import Link from 'next/link';

import { Logo } from '@/components/logo';

export function SiteBranding() {
  return (
    <h1 className="flex items-center text-2xl">
      <Link className="flex shrink-0 items-center" href="/">
        <Logo className="block h-6 w-auto" />
        <span className="sr-only">TREADTalks</span>
      </Link>
    </h1>
  );
}
