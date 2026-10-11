import type { Metadata } from 'next';

import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { CodeBlock } from '@/components/ui';
import { site } from '@/configs/site';

const MCP_URL = `${site.url}/mcp`;
const PAGE_DESCRIPTION =
  'Connect Claude, ChatGPT, or Cursor to search talks, speakers, topics, collections, and clips.';
const PAGE_TITLE = 'Ask AI about TREAD talks';

const MCP_CONFIG = `{
  "mcpServers": {
    "gettreadtalks": {
      "url": "${MCP_URL}"
    }
  }
}`;

const EXAMPLE_PROMPTS = [
  'Find a talk on suffering.',
  'What has Paul Washer preached on prayer?',
  'Show me the On Death and Dying collection.',
] as const;

const TOOL_GROUPS = [
  {
    heading: 'Search',
    tools: [
      {
        name: 'search_talks',
        summary: 'Talks by text, speaker, or topic.',
      },
    ],
  },
  {
    heading: 'Get',
    tools: [
      {
        name: 'get_talk',
        summary: 'One talk with speaker, topics, collection, and clips.',
      },
      {
        name: 'get_collection',
        summary: 'One collection and its talks.',
      },
      {
        name: 'get_clip',
        summary: 'One clip with speaker and parent talk.',
      },
    ],
  },
  {
    heading: 'List',
    tools: [
      {
        name: 'list_speakers',
        summary: 'Speakers with published talks or clips.',
      },
      {
        name: 'list_topics',
        summary: 'Topics with published talks.',
      },
      {
        name: 'list_collections',
        summary: 'Collections with published talks.',
      },
      {
        name: 'list_clips',
        summary: 'Clips by text or speaker.',
      },
    ],
  },
] as const;

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
        <CodeBlock
          code={MCP_CONFIG}
          copyLabel="Copy MCP config"
          copyTestId="copy-mcp-url"
        />
        <div className="text-muted-foreground space-y-1 text-sm">
          <p>Claude: Customize → Connectors → custom connector. No sign-in.</p>
          <p>ChatGPT: Settings → Apps → Developer Mode, then add the URL.</p>
          <p>
            Cursor: paste into <code>.cursor/mcp.json</code> or{' '}
            <code>~/.cursor/mcp.json</code>.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Example prompts</h2>
        <ul className="list-disc space-y-1 pl-5">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tools</h2>
        {TOOL_GROUPS.map((group) => (
          <div className="space-y-1" key={group.heading}>
            <h3 className="text-sm font-medium">{group.heading}</h3>
            <ul className="list-none space-y-1 pl-0 text-sm">
              {group.tools.map((tool) => (
                <li key={tool.name}>
                  <code>{tool.name}</code> {tool.summary}
                </li>
              ))}
            </ul>
          </div>
        ))}
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
