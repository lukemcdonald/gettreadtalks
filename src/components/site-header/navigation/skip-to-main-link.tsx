export function SkipToMainLink() {
  return (
    <a
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      href="#main-content"
    >
      Skip to main content
    </a>
  );
}
