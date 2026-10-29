import type { VerificationEmailProps } from '../../src/services/email/types';

import { Text } from 'react-email';

import { site } from '../../src/configs/site';
import {
  EmailButton,
  EmailFallbackLink,
  EmailLayout,
  EmailSupport,
} from './components/layout';
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
      <EmailButton href={verificationUrl} label="Verify email" />
      <EmailFallbackLink href={verificationUrl} />
      <Text style={emailParagraph}>
        If you didn&apos;t create an account, you can ignore this email.
      </Text>
      <EmailSupport />
    </EmailLayout>
  );
}
