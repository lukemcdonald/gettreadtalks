import { site } from '@/configs/site';

interface CopyrightProps {
  className?: string;
}

export function Copyright({ className }: CopyrightProps) {
  const year = new Date().getFullYear();

  return (
    <span className={className}>
      &copy; {site.name} {year}
    </span>
  );
}
