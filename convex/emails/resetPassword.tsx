import type { PasswordResetEmailProps } from '../../lib/services/email/types';

import { Button, Section, Text } from '@react-email/components';

import { EmailLayout } from './components/layout';

export function ResetPasswordTemplate({ email, resetUrl }: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your TreadTalks password to regain access to your account.">
      <Text style={paragraph}>Hi there,</Text>
      <Text style={paragraph}>
        We received a request to reset the password for your TreadTalks account ({email}). If you
        made this request, click the button below to create a new password.
      </Text>
      <Section style={buttonContainer}>
        <Button href={resetUrl} style={button}>
          Reset Password
        </Button>
      </Section>
      <Text style={paragraph}>Or copy and paste this link into your browser:</Text>
      <Text style={linkText}>{resetUrl}</Text>
      <Text style={paragraph}>
        <strong>Security notes:</strong>
      </Text>
      <Text style={listItem}>• This password reset link will expire in 1 hour for security</Text>
      <Text style={listItem}>
        • If you didn't request this reset, you can safely ignore this email
      </Text>
      <Text style={listItem}>
        • Your current password remains unchanged until you create a new one
      </Text>
      <Text style={paragraph}>
        If you continue having trouble accessing your account, please contact our support team.
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

const linkText = {
  color: '#2754C5',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
};
