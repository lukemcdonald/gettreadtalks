export function SkipNavLink({ href }: { href: string }) {
  return (
    <a
      className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
      href={href}
    >
      Skip to content
    </a>
  );
}
