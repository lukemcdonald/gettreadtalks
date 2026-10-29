import type { WelcomeEmailProps } from '../../src/services/email/types';

import { Text } from 'react-email';

import { site } from '../../src/configs/site';
import { EmailButton, EmailLayout, EmailSupport } from './components/layout';
import { emailParagraph } from './components/styles';

export function WelcomeEmail({ name, siteUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout
      heading={`Welcome, ${name}`}
      preview={`Welcome to ${site.name}, ${name}.`}
    >
      <Text style={emailParagraph}>
        Your {site.name} account is ready. Browse talks and save favorites to
        come back to.
      </Text>
      <EmailButton href={siteUrl} label="Explore talks" />
      <EmailSupport />
    </EmailLayout>
  );
}
