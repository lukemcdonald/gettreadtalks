import type { WelcomeEmailProps } from '../../src/services/email/types';

import { Button, Section, Text } from 'react-email';

import { site } from '../../src/configs/site';
import { EmailLayout } from './components/layout';
import {
  emailButton,
  emailButtonContainer,
  emailListItem,
  emailParagraph,
} from './components/styles';

export function WelcomeEmail({ name, siteUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to ${site.name}, ${name}!`}>
      <Text style={emailParagraph}>Hi {name},</Text>
      <Text style={emailParagraph}>
        Welcome to {site.name}! We&apos;re excited to have you join our
        community of believers seeking to deepen their faith through inspiring
        talks and insights.
      </Text>
      <Text style={emailParagraph}>With your new account, you can:</Text>
      <Text style={emailListItem}>
        • Access our growing library of Christian talks
      </Text>
      <Text style={emailListItem}>
        • Save your favorite talks to personalized collections
      </Text>
      <Text style={emailListItem}>
        • Get personalized recommendations based on your interests
      </Text>
      <Text style={emailParagraph}>
        Get started by exploring some of our most popular talks:
      </Text>
      <Section style={emailButtonContainer}>
        <Button href={siteUrl} style={emailButton}>
          Explore Talks
        </Button>
      </Section>
      <Text style={emailParagraph}>
        If you have any questions or need help getting started, don&apos;t
        hesitate to reach out to us.
      </Text>
      <Text style={emailParagraph}>Blessings,</Text>
      <Text style={emailParagraph}>The {site.name} Team</Text>
    </EmailLayout>
  );
}
