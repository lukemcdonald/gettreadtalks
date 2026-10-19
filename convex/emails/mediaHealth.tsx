import type {
  MediaHealthEmailItem,
  MediaHealthEmailProps,
} from '../../src/services/email/types';

import { Button, Heading, Hr, Link, Section, Text } from 'react-email';

import { site } from '../../src/configs/site';
import { toYouTubeWatchUrl } from '../../src/utils/youtube';
import { EmailLayout } from './components/layout';
import { emailButton, emailParagraph } from './components/styles';

export function MediaHealthEmail({
  items,
  siteUrl,
  stillOpenCount,
  stillOpenHref,
}: MediaHealthEmailProps) {
  const talks = items.filter((item) => item.entityTable === 'talks');
  const clips = items.filter((item) => item.entityTable === 'clips');

  return (
    <EmailLayout preview="New private or missing talk and clip media needs a look.">
      <Text style={emailParagraph}>Hi,</Text>
      <Text style={emailParagraph}>
        These published YouTube or Vimeo URLs are newly private or missing. Open
        in admin to review; nothing is saved until you press Save.
      </Text>
      {talks.length > 0 && (
        <>
          <Heading as="h2" style={sectionHeading}>
            Talks
          </Heading>
          {talks.map((item, index) => (
            <MediaHealthItem
              isLast={index === talks.length - 1 && clips.length === 0}
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
          {clips.map((item, index) => (
            <MediaHealthItem
              isLast={index === clips.length - 1}
              item={item}
              key={`${item.entityTable}-${item.adminPath}`}
              siteUrl={siteUrl}
            />
          ))}
        </>
      )}
      {stillOpenCount > 0 && (
        <Text style={emailParagraph}>
          {stillOpenCount} still open.{' '}
          <Link href={stillOpenHref} style={inlineLink}>
            View open items
          </Link>
        </Text>
      )}
      <Text style={emailParagraph}>Blessings,</Text>
      <Text style={emailParagraph}>The {site.name} job runner</Text>
    </EmailLayout>
  );
}

function MediaHealthItem({
  isLast,
  item,
  siteUrl,
}: {
  isLast: boolean;
  item: MediaHealthEmailItem;
  siteUrl: string;
}) {
  const adminHref = `${siteUrl}${item.adminPath}`;
  const publicHref = item.publicPath ? `${siteUrl}${item.publicPath}` : null;
  const videoHref = toYouTubeWatchUrl(item.mediaUrl);

  return (
    <Section style={itemSection}>
      <Text style={titleText}>{item.title}</Text>
      <Text style={metaText}>
        {getMediaHealthStatusLabel(item.newStatus)} · First seen broken{' '}
        {formatBrokenDate(item.firstBrokenAt)}
      </Text>
      <Section style={buttonContainer}>
        <Button href={adminHref} style={button}>
          Open in admin
        </Button>
        <MediaHealthPageButton href={publicHref} />
        <Button href={videoHref} style={secondaryButton}>
          Check video
        </Button>
      </Section>
      <MediaHealthItemDivider isLast={isLast} />
    </Section>
  );
}

function getMediaHealthStatusLabel(status: MediaHealthEmailItem['newStatus']) {
  if (status === 'private') {
    return 'Private';
  }

  return 'Missing';
}

function MediaHealthPageButton({ href }: { href: string | null }) {
  if (!href) {
    return null;
  }

  return (
    <Button href={href} style={secondaryButton}>
      View page
    </Button>
  );
}

function MediaHealthItemDivider({ isLast }: { isLast: boolean }) {
  if (isLast) {
    return null;
  }

  return <Hr style={itemDivider} />;
}

function formatBrokenDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const button = {
  ...emailButton,
  margin: '0 8px 8px 0',
};

const buttonContainer = {
  margin: '12px 0 0',
};

const inlineLink = {
  color: '#2754C5',
  fontSize: '16px',
  textDecoration: 'underline',
};

const itemDivider = {
  borderColor: '#eaeaea',
  margin: '20px 0 0',
};

const itemSection = {
  margin: '0 0 8px',
};

const metaText = {
  color: '#555',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 4px',
};

const secondaryButton = {
  ...button,
  backgroundColor: '#fff',
  border: '1px solid #2754C5',
  color: '#2754C5',
};

const sectionHeading = {
  color: '#111',
  fontSize: '18px',
  fontWeight: 'bold',
  lineHeight: '26px',
  margin: '32px 0 16px',
};

const titleText = {
  color: '#111',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '24px',
  margin: '0 0 4px',
};
