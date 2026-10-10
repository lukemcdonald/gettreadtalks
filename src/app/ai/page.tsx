import type { Metadata } from 'next';

import { CopyMcpUrlButton } from '@/app/ai/_components/copy-mcp-url-button';
import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { site } from '@/configs/site';

const MCP_URL = `${site.url}/mcp`;
const PAGE_DESCRIPTION =
  'Connect Claude, ChatGPT, or Cursor to search talks, speakers, topics, collections, and clips.';
const PAGE_TITLE = 'Ask AI about TREAD talks';

const EXAMPLE_PROMPTS = [
  'Find a talk on suffering.',
  'What has Paul Washer preached on prayer?',
  'Show me the On Death and Dying collection.',
  'Find John Piper talks on missions.',
] as const;

const TOOL_CAPABILITIES = [
  'Search talks by text, speaker, or topic.',
  'Get one talk with its speaker, topics, collection, and clips.',
  'List speakers with published talks or clips.',
  'List topics that have published talks.',
  'List collections that contain published talks.',
  'Get one collection and its talks.',
  'List published clips by text or speaker.',
  'Get one clip with its speaker and parent talk.',
] as const;

const CURSOR_MCP_JSON = `{
  "mcpServers": {
    "gettreadtalks": {
      "url": "${MCP_URL}"
    }
  }
}`;

export const metadata: Metadata = {
  description: PAGE_DESCRIPTION,
  openGraph: {
    description: PAGE_DESCRIPTION,
    images: [
      {
        alt: site.name,
        height: 630,
        url: '/default-seo-image.png',
        width: 1200,
      },
    ],
    title: PAGE_TITLE,
    url: '/ai',
  },
  title: PAGE_TITLE,
  twitter: {
    card: 'summary_large_image',
    description: PAGE_DESCRIPTION,
    title: PAGE_TITLE,
  },
};

function AiPageContent() {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Example prompts</h2>
        <ul className="list-disc space-y-1 pl-5">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Connect</h2>
        <p>Add this server URL to your AI client. No account is required.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="bg-muted block rounded-lg px-3 py-2 text-sm break-all">
            {MCP_URL}
          </code>
          <CopyMcpUrlButton url={MCP_URL} />
        </div>

        <h3 className="font-medium">Claude</h3>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Open Customize, then Connectors.</li>
          <li>Add a custom connector and paste the URL.</li>
          <li>Choose no sign-in.</li>
        </ol>

        <h3 className="font-medium">ChatGPT</h3>
        <p>
          Available where ChatGPT supports custom MCP connectors (Developer
          Mode).
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Enable Developer Mode under Settings, then Apps.</li>
          <li>Create a custom app and add this server URL.</li>
          <li>No authentication is required.</li>
        </ol>

        <h3 className="font-medium">Cursor</h3>
        <p>
          Add this to <code>.cursor/mcp.json</code> in a project, or{' '}
          <code>~/.cursor/mcp.json</code> for every project:
        </p>
        <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-sm">
          <code>{CURSOR_MCP_JSON}</code>
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What it can do</h2>
        <ul className="list-disc space-y-1 pl-5">
          {TOOL_CAPABILITIES.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Trust</h2>
        <p>
          The server is read-only. It returns public catalog content only. No
          account is required. Requests are rate-limited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Coming soon</h2>
        <p>Talk summaries and signed-in tools such as favorites.</p>
      </section>
    </>
  );
}

export default function AiPage() {
  return (
    <CenteredLayout
      content={<AiPageContent />}
      header={<PageHeader description={PAGE_DESCRIPTION} title={PAGE_TITLE} />}
    />
  );
}
