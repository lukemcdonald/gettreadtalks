import Link from 'next/link';

function FauxLink({ children, ...delegated }: React.ComponentProps<typeof Link>) {
  return (
    <Link {...delegated}>
      <span className="absolute inset-0" />
      {children}
    </Link>
  );
}

export { FauxLink };
