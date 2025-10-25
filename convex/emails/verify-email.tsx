import type { VerificationEmailProps } from '../../lib/services/email/types';

import { Button, Section, Text } from '@react-email/components';

import { EmailLayout } from './_components/layout';

export function VerifyEmailTemplate({ verificationUrl, email, token }: VerificationEmailProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  token; // token parameter is part of the interface and could be used for additional verification
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  email; // email parameter is part of the interface and could be used for personalization
  return (
    <EmailLayout preview="Please verify your email address to complete your TreadTalks registration.">
      <Text style={paragraph}>Hi there,</Text>
      <Text style={paragraph}>
        Thank you for signing up for TreadTalks! To complete your registration and start accessing
        our collection of Christian talks, please verify your email address by clicking the button
        below.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={verificationUrl}>
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
        If you didn't create an account with TreadTalks, you can safely ignore this email.
      </Text>
      <Text style={paragraph}>Blessings,</Text>
      <Text style={paragraph}>The TreadTalks Team</Text>
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
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2754C5',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '50px',
  textDecoration: 'none',
  padding: '0 20px',
};

const linkText = {
  color: '#2754C5',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
};
