/** Long-form text with one paragraph per line, the first as a lead. */
export function ProseParagraphs({ text }: { text: string }) {
  return (
    <div className="text-foreground max-w-prose space-y-5 text-base leading-7">
      {text
        .split(/\n+/u)
        .filter(Boolean)
        .map((paragraph, index) => (
          <p
            className={index === 0 ? 'text-lg leading-8' : undefined}
            key={`${index}:${paragraph}`}
          >
            {paragraph}
          </p>
        ))}
    </div>
  );
}
