import type { PasswordResetEmailProps } from '../../src/services/email/types';

import { Text } from 'react-email';

import { site } from '../../src/configs/site';
import { EmailAction, EmailLayout, EmailSupport } from './components/layout';
import { emailParagraph } from './components/styles';

export function ResetPasswordTemplate({
  email,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout
      heading="Reset your password"
      preview={`Reset your ${site.name} password. This link expires in 1 hour.`}
    >
      <Text style={emailParagraph}>
        Someone asked to reset the password for {email}. The link expires in 1
        hour.
      </Text>
      <EmailAction href={resetUrl} label="Reset password" />
      <Text style={emailParagraph}>
        If you didn&apos;t ask for this, you can ignore this email. Your
        password stays the same.
      </Text>
      <EmailSupport />
    </EmailLayout>
  );
}
