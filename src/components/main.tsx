type MainProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'main'>;

export function Main({ children, ...delegated }: MainProps) {
  return (
    <main id="main" {...delegated}>
      {children}
    </main>
  );
}
