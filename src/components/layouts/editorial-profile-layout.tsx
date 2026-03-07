import type { ReactNode } from 'react';

import { Container } from '@/components/ui';

interface EditorialProfileLayoutProps {
  breadcrumb?: ReactNode;
  content: ReactNode;
  hero: ReactNode;
}

export function EditorialProfileLayout({ breadcrumb, content, hero }: EditorialProfileLayoutProps) {
  return (
    <div className="-mt-6 sm:-mt-8 md:-mt-10 lg:-mt-12">
      {!!breadcrumb && (
        <div className="dark border-border border-t border-b bg-background px-4 py-3 sm:px-6">
          <Container className="flex justify-center">{breadcrumb}</Container>
        </div>
      )}

      {hero}

      <section className="px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <Container className="space-y-16 md:space-y-20">{content}</Container>
      </section>
    </div>
  );
}
