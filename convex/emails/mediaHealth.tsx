import type {
  MediaHealthEmailItem,
  MediaHealthEmailProps,
} from '../../src/services/email/types';

import { Button, Heading, Section, Text } from 'react-email';

import { site } from '../../src/configs/site';
import { EmailLayout } from './components/layout';
import { emailButton, emailColors, emailParagraph } from './components/styles';

export function MediaHealthEmail({ items, siteUrl }: MediaHealthEmailProps) {
  const newItems = items.filter((item) => item.isNew);
  const unresolvedItems = items.filter((item) => !item.isNew);

  return (
    <EmailLayout preview="Private or missing talk and clip media still needs a look.">
      <Text style={emailParagraph}>Hi,</Text>
      <Text style={emailParagraph}>
        These published YouTube or Vimeo URLs are private or missing and still
        need action. New since last email is anything flagged since the last
        digest. Still unresolved was already reported and has not been archived
        or fixed. Open in admin to review and archive — Archived is preselected,
        and nothing is saved until you press Save. View page opens the public
        talk or clip. Check video opens the YouTube or Vimeo page. This job does
        not change content for you.
      </Text>
      <MediaHealthGroup
        heading="New since last email"
        items={newItems}
        siteUrl={siteUrl}
      />
      <MediaHealthGroup
        heading="Still unresolved"
        items={unresolvedItems}
        siteUrl={siteUrl}
      />
      <Text style={emailParagraph}>Blessings,</Text>
      <Text style={emailParagraph}>The {site.name} job runner</Text>
    </EmailLayout>
  );
}

function MediaHealthGroup({
  heading,
  items,
  siteUrl,
}: {
  heading: string;
  items: MediaHealthEmailItem[];
  siteUrl: string;
}) {
  if (items.length === 0) {
    return null;
  }

  const clips = items.filter((item) => item.entityTable === 'clips');
  const talks = items.filter((item) => item.entityTable === 'talks');

  return (
    <>
      <Heading as="h2" style={sectionHeading}>
        {heading}
      </Heading>
      {talks.length > 0 && (
        <>
          <Heading as="h3" style={entityHeading}>
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
          <Heading as="h3" style={entityHeading}>
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
    </>
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
        {item.entityTable} · {item.newStatus}
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
  ...emailButton,
  fontSize: '14px',
  lineHeight: '40px',
  padding: '0 16px',
};

const buttonContainer = {
  margin: '12px 0 0',
};

const entityHeading = {
  color: emailColors.foreground,
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '16px 0 8px',
};

const itemSection = {
  margin: '0 0 20px',
};

const metaText = {
  color: emailColors.muted,
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 4px',
};

const secondaryButton = {
  ...button,
  backgroundColor: emailColors.card,
  border: `1px solid ${emailColors.primary}`,
  color: emailColors.primary,
  marginLeft: '8px',
};

const sectionHeading = {
  color: emailColors.foreground,
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '26px',
  margin: '24px 0 8px',
};

const titleText = {
  color: emailColors.foreground,
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 4px',
};
