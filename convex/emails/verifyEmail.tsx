import type { VerificationEmailProps } from '../../src/services/email/types';

import { Text } from 'react-email';

import { site } from '../../src/configs/site';
import { EmailAction, EmailLayout, EmailSupport } from './components/layout';
import { emailParagraph } from './components/styles';

export function VerifyEmailTemplate({
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <EmailLayout
      heading="Confirm your email"
      preview={`Confirm your email for ${site.name}. This link expires in 24 hours.`}
    >
      <Text style={emailParagraph}>
        Finish creating your {site.name} account. This link expires in 24 hours.
      </Text>
      <EmailAction href={verificationUrl} label="Verify email" />
      <Text style={emailParagraph}>
        If you didn&apos;t create an account, you can ignore this email.
      </Text>
      <EmailSupport />
    </EmailLayout>
  );
}
