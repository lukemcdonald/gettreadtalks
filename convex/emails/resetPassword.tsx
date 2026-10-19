import type { PasswordResetEmailProps } from '../../src/services/email/types';

import { Button, Section, Text } from 'react-email';

import { site } from '../../src/configs/site';
import { EmailLayout } from './components/layout';
import {
  emailButton,
  emailButtonContainer,
  emailLinkText,
  emailListItem,
  emailParagraph,
} from './components/styles';

export function ResetPasswordTemplate({
  email,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout
      preview={`Reset your ${site.name} password to regain access to your account.`}
    >
      <Text style={emailParagraph}>Hi there,</Text>
      <Text style={emailParagraph}>
        We received a request to reset the password for your {site.name} account
        ({email}). If you made this request, click the button below to create a
        new password.
      </Text>
      <Section style={emailButtonContainer}>
        <Button href={resetUrl} style={emailButton}>
          Reset Password
        </Button>
      </Section>
      <Text style={emailParagraph}>
        Or copy and paste this link into your browser:
      </Text>
      <Text style={emailLinkText}>{resetUrl}</Text>
      <Text style={emailParagraph}>
        <strong>Security notes:</strong>
      </Text>
      <Text style={emailListItem}>
        • This password reset link will expire in 1 hour for security
      </Text>
      <Text style={emailListItem}>
        • If you didn&apos;t request this reset, you can safely ignore this
        email
      </Text>
      <Text style={emailListItem}>
        • Your current password remains unchanged until you create a new one
      </Text>
      <Text style={emailParagraph}>
        If you continue having trouble accessing your account, please contact
        our support team.
      </Text>
      <Text style={emailParagraph}>Blessings,</Text>
      <Text style={emailParagraph}>The {site.name} Team</Text>
    </EmailLayout>
  );
}
