import type { WelcomeEmailProps } from '../../src/services/email/types';

import { Button, Section, Text } from '@react-email/components';

import { EmailLayout } from './components/layout';

export function WelcomeEmail({ name, siteUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to TREAD Talks, ${name}!`}>
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Welcome to TREAD Talks! We're excited to have you join our community of believers seeking to
        deepen their faith through inspiring talks and insights.
      </Text>
      <Text style={paragraph}>With your new account, you can:</Text>
      <Text style={listItem}>• Access our growing library of Christian talks</Text>
      <Text style={listItem}>• Save your favorite talks to personalized collections</Text>
      <Text style={listItem}>• Get personalized recommendations based on your interests</Text>
      <Text style={paragraph}>Get started by exploring some of our most popular talks:</Text>
      <Section style={buttonContainer}>
        <Button href={siteUrl} style={button}>
          Explore Talks
        </Button>
      </Section>
      <Text style={paragraph}>
        If you have any questions or need help getting started, don't hesitate to reach out to us.
      </Text>
      <Text style={paragraph}>Blessings,</Text>
      <Text style={paragraph}>The TREAD Talks Team</Text>
    </EmailLayout>
  );
}

const paragraph = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 8px',
  paddingLeft: '20px',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2754C5',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '50px',
  padding: '0 20px',
  textDecoration: 'none',
};
