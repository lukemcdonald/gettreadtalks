import type { ReactNode } from 'react';

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'react-email';

import { site } from '../../../src/configs/site';

interface EmailLayoutProps {
  children: ReactNode;
  preview?: string;
}

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {!!preview && <Preview>{preview}</Preview>}
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{site.name}</Heading>
            <Text style={subtitle}>Christian talks and insights</Text>
          </Section>

          <Hr style={hr} />

          {children}

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              You received this email because you have an account with{' '}
              {site.name}.
            </Text>
            <Text style={footerText}>
              {site.name} • {site.description}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '24px 20px 32px',
  width: '100%',
};

const footer = {
  paddingTop: '8px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 8px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: '32px',
  margin: '0 0 8px',
  padding: '0',
};

const header = {
  marginBottom: '8px',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#eaeaea',
  margin: '24px 0',
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  margin: '0',
  padding: '16px 0',
  width: '100%',
};

const subtitle = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};
