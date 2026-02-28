import type { VerificationEmailProps } from '../../src/services/email/types';

import { Button, Section, Text } from '@react-email/components';

import { site } from '../../src/configs/site';
import { EmailLayout } from './components/layout';

export function VerifyEmailTemplate({ verificationUrl }: VerificationEmailProps) {
  return (
    <EmailLayout preview="Please verify your email address to complete your {site.name} registration.">
      <Text style={paragraph}>Hi there,</Text>
      <Text style={paragraph}>
        Thank you for signing up for {site.name}! To complete your registration and start accessing
        our collection of Christian talks, please verify your email address by clicking the button
        below.
      </Text>
      <Section style={buttonContainer}>
        <Button href={verificationUrl} style={button}>
          Verify Email Address
        </Button>
      </Section>
      <Text style={paragraph}>Or copy and paste this link into your browser:</Text>
      <Text style={linkText}>{verificationUrl}</Text>
      <Text style={paragraph}>
        <strong>Important:</strong> This verification link will expire in 24 hours for security
        reasons.
      </Text>
      <Text style={paragraph}>
        If you didn't create an account with {site.name}, you can safely ignore this email.
      </Text>
      <Text style={paragraph}>Blessings,</Text>
      <Text style={paragraph}>The {site.name} Team</Text>
    </EmailLayout>
  );
}

const paragraph = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
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

const linkText = {
  color: '#2754C5',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
};
