import type { VerificationEmailProps } from '../../src/services/email/types';

import { Button, Section, Text } from 'react-email';

import { site } from '../../src/configs/site';
import { EmailLayout } from './components/layout';
import {
  emailButton,
  emailButtonContainer,
  emailLinkText,
  emailParagraph,
} from './components/styles';

export function VerifyEmailTemplate({
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <EmailLayout
      preview={`Please verify your email address to complete your ${site.name} registration.`}
    >
      <Text style={emailParagraph}>Hi there,</Text>
      <Text style={emailParagraph}>
        Thank you for signing up for {site.name}! To complete your registration
        and start accessing our collection of Christian talks, please verify
        your email address by clicking the button below.
      </Text>
      <Section style={emailButtonContainer}>
        <Button href={verificationUrl} style={emailButton}>
          Verify Email Address
        </Button>
      </Section>
      <Text style={emailParagraph}>
        Or copy and paste this link into your browser:
      </Text>
      <Text style={emailLinkText}>{verificationUrl}</Text>
      <Text style={emailParagraph}>
        <strong>Important:</strong> This verification link will expire in 24
        hours for security reasons.
      </Text>
      <Text style={emailParagraph}>
        If you didn&apos;t create an account with {site.name}, you can safely
        ignore this email.
      </Text>
      <Text style={emailParagraph}>Blessings,</Text>
      <Text style={emailParagraph}>The {site.name} Team</Text>
    </EmailLayout>
  );
}
