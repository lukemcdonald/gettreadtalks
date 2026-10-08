import type {
  MediaHealthEmailItem,
  MediaHealthEmailProps,
} from '../../src/services/email/types';

import { Button, Heading, Section, Text } from 'react-email';

import { site } from '../../src/configs/site';
import { EmailLayout } from './components/layout';

export function MediaHealthEmail({ items }: MediaHealthEmailProps) {
  const talks = items.filter((item) => item.entityTable === 'talks');
  const clips = items.filter((item) => item.entityTable === 'clips');
  const siteUrl = process.env.SITE_URL || site.url;

  return (
    <EmailLayout preview="Private or missing talk and clip media needs a look.">
      <Text style={paragraph}>Hi,</Text>
      <Text style={paragraph}>
        These published YouTube or Vimeo URLs are currently private or missing.
        Items marked New broke since the last check; the rest are still broken.
        Open in admin to review and archive — Archived is preselected, and
        nothing is saved until you press Save. View page opens the public talk
        or clip. Check video opens the YouTube or Vimeo page. This job does not
        change content for you.
      </Text>
      {talks.length > 0 && (
        <>
          <Heading as="h2" style={sectionHeading}>
            Talks
          </Heading>
          {talks.map((item) => (
            <MediaHealthItem
              item={item}
              key={`${item.entityTable}-${item.adminPath}`}
              siteUrl={siteUrl}
            />
          ))}
        </>
      )}
      {clips.length > 0 && (
        <>
          <Heading as="h2" style={sectionHeading}>
            Clips
          </Heading>
          {clips.map((item) => (
            <MediaHealthItem
              item={item}
              key={`${item.entityTable}-${item.adminPath}`}
              siteUrl={siteUrl}
            />
          ))}
        </>
      )}
      <Text style={paragraph}>Blessings,</Text>
      <Text style={paragraph}>The {site.name} job runner</Text>
    </EmailLayout>
  );
}

function MediaHealthItem({
  item,
  siteUrl,
}: {
  item: MediaHealthEmailItem;
  siteUrl: string;
}) {
  const adminHref = `${siteUrl}${item.adminPath}`;
  const publicHref = item.publicPath ? `${siteUrl}${item.publicPath}` : null;

  return (
    <Section style={itemSection}>
      <Text style={titleText}>{item.title}</Text>
      <Text style={metaText}>
        {item.isNew ? 'New · ' : ''}
        {item.entityTable} · {item.previousStatus} to {item.newStatus}
      </Text>
      <Text style={metaText}>{item.mediaUrl}</Text>
      <Section style={buttonContainer}>
        <Button href={adminHref} style={button}>
          Open in admin
        </Button>
        {publicHref ? (
          <Button href={publicHref} style={secondaryButton}>
            View page
          </Button>
        ) : null}
        <Button href={item.mediaUrl} style={secondaryButton}>
          Check video
        </Button>
      </Section>
    </Section>
  );
}

const button = {
  backgroundColor: '#2754C5',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  lineHeight: '40px',
  padding: '0 16px',
  textDecoration: 'none',
};

const buttonContainer = {
  margin: '12px 0 0',
};

const itemSection = {
  margin: '0 0 20px',
};

const metaText = {
  color: '#555',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 4px',
};

const paragraph = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const secondaryButton = {
  ...button,
  backgroundColor: '#fff',
  border: '1px solid #2754C5',
  color: '#2754C5',
  marginLeft: '8px',
};

const sectionHeading = {
  color: '#111',
  fontSize: '18px',
  fontWeight: 'bold',
  lineHeight: '26px',
  margin: '24px 0 8px',
};

const titleText = {
  color: '#111',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '24px',
  margin: '0 0 4px',
};
