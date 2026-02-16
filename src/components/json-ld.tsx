interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders a JSON-LD structured data script tag. Next.js hoists it to <head>. */
export function JsonLd({ data }: JsonLdProps) {
  // Replace `<` with its unicode escape to prevent script injection if data ever
  // contains a closing tag sequence. Recommended by Next.js JSON-LD docs.
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data — `<` is escaped below
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
      type="application/ld+json"
    />
  );
}
