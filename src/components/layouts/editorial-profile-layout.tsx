import type { ReactNode } from 'react';

import { Container } from '@/components/ui';

interface EditorialProfileLayoutProps {
  hero: ReactNode;
  content: ReactNode;
}

export function EditorialProfileLayout({ hero, content }: EditorialProfileLayoutProps) {
  return (
    <div className="-mt-6 sm:-mt-8 md:-mt-10 lg:-mt-12">
      {hero}

      <section className="px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <Container className="space-y-16 md:space-y-20">{content}</Container>
      </section>
    </div>
  );
}
