import type { ReactNode } from 'react';

interface SpeakerSectionProps {
  children: ReactNode;
  description?: string;
  id?: string;
  title: string;
}

export function SpeakerSection({ children, description, id, title }: SpeakerSectionProps) {
  return (
    <section className="space-y-8" id={id}>
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <div className="text-center">
          <h2 className="font-semibold text-2xl tracking-tight md:text-3xl">{title}</h2>
          {description && <p className="mt-2 text-muted-foreground">{description}</p>}
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  );
}
