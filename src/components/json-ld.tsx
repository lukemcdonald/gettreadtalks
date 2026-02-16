interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders a JSON-LD structured data script tag. Next.js hoists it to <head>. */
export function JsonLd({ data }: JsonLdProps) {
  // Safe: data is developer-controlled structured data serialized by JSON.stringify,
  // never user input. This is the pattern recommended by Next.js docs for JSON-LD.
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is developer-controlled, not user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}
