import type { ReactNode } from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email';

import { site } from '../../../src/configs/site';
import {
  emailButton,
  emailButtonContainer,
  emailColors,
  emailFallbackLabel,
  emailFallbackLink,
  emailFontFamily,
  emailHeading,
  emailParagraph,
  emailSupportLink,
} from './styles';

const LOGO_HEIGHT = 33;
const LOGO_WIDTH = 240;

interface EmailButtonProps {
  href: string;
  label: string;
}

interface EmailFallbackLinkProps {
  href: string;
}

interface EmailLayoutProps {
  children: ReactNode;
  heading?: string;
  preview?: string;
}

export function EmailButton({ href, label }: EmailButtonProps) {
  return (
    <Section align="left" style={emailButtonContainer}>
      <Button href={href} style={emailButton}>
        {label}
      </Button>
    </Section>
  );
}

export function EmailFallbackLink({ href }: EmailFallbackLinkProps) {
  return (
    <Text style={emailFallbackLabel}>
      Button not working? Paste this link:
      <Link href={href} style={emailFallbackLink}>
        {href}
      </Link>
    </Text>
  );
}

export function EmailLayout({ children, heading, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <meta content="light" name="color-scheme" />
        <meta content="light" name="supported-color-schemes" />
      </Head>
      {!!preview && <Preview>{preview}</Preview>}
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Link href={site.url} style={logoLink}>
              <Img
                alt={site.name}
                height={LOGO_HEIGHT}
                src={`${site.url}/logo.png`}
                style={logo}
                width={LOGO_WIDTH}
              />
            </Link>
          </Section>

          <Hr style={hr} />

          {heading ? (
            <Heading as="h1" style={emailHeading}>
              {heading}
            </Heading>
          ) : null}

          {children}

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              You received this because you have a {site.name} account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailSupport() {
  return (
    <Text style={emailParagraph}>
      Questions?{' '}
      <Link href={`mailto:${site.email.contact}`} style={emailSupportLink}>
        {site.email.contact}
      </Link>
    </Text>
  );
}

const container = {
  backgroundColor: emailColors.card,
  margin: '0 auto',
  maxWidth: '600px',
  padding: '28px 24px 32px',
  width: '100%',
};

const footer = {
  paddingTop: '4px',
  textAlign: 'center' as const,
};

const footerText = {
  color: emailColors.mutedSoft,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
};

const header = {
  textAlign: 'center' as const,
};

const hr = {
  borderColor: emailColors.border,
  margin: '20px 0',
};

const logo = {
  display: 'block',
  height: `${LOGO_HEIGHT}px`,
  margin: '0 auto',
  width: `${LOGO_WIDTH}px`,
};

const logoLink = {
  display: 'inline-block',
  textDecoration: 'none',
};

const main = {
  backgroundColor: emailColors.background,
  fontFamily: emailFontFamily,
  margin: '0',
  padding: '16px 0',
  width: '100%',
};
