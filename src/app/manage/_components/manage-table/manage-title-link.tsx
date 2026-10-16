'use client';

import type { ReactNode } from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui';
import { Link } from '@/components/ui/link';

const TITLE_LINK_CLASSNAME =
  'block truncate font-medium after:absolute after:inset-0';

export function ManageTitleLink({
  hover,
  href,
  title,
}: {
  hover?: ReactNode;
  href: string;
  title: string;
}) {
  if (!hover) {
    return (
      <Link className={TITLE_LINK_CLASSNAME} href={href}>
        {title}
      </Link>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        closeDelay={0}
        delay={0}
        render={<Link className={TITLE_LINK_CLASSNAME} href={href} />}
      >
        {title}
      </HoverCardTrigger>
      <HoverCardContent align="start">{hover}</HoverCardContent>
    </HoverCard>
  );
}
