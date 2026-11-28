/** Long-form text split on blank lines, with the first paragraph as a lead. */
export function ProseParagraphs({ text }: { text: string }) {
  return (
    <div className="text-foreground max-w-prose space-y-5 text-base leading-7">
      {text
        .split(/\n+/u)
        .filter(Boolean)
        .map((paragraph, index) => (
          <p
            className={index === 0 ? 'text-lg leading-8' : undefined}
            key={paragraph}
          >
            {paragraph}
          </p>
        ))}
    </div>
  );
}
