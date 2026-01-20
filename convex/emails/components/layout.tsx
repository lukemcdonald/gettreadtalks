import type { ReactNode } from 'react';

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

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
          <Section style={content}>
            <Section style={header}>
              <Heading style={h1}>TreadTalks</Heading>
              <Text style={subtitle}>Christian talks and insights</Text>
            </Section>

            <Hr style={hr} />

            {children}

            <Hr style={hr} />

            <Section style={footer}>
              <Text style={footerText}>
                You received this email because you have an account with TreadTalks.
              </Text>
              <Text style={footerText}>
                If you no longer wish to receive these emails, you can{' '}
                <Link href="#" style={link}>
                  unsubscribe here
                </Link>
                .
              </Text>
              <Text style={footerText}>
                TreadTalks • Your trusted source for Christian talks and insights
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const content = {
  border: '1px solid #eaeaea',
  borderRadius: '5px',
  margin: '40px auto',
  maxWidth: '600px',
  padding: '20px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: '40px',
  margin: '30px 0',
  padding: '0',
};

const subtitle = {
  color: '#666',
  fontSize: '14px',
  margin: '0 0 20px',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '20px 0',
};

const footer = {
  borderTop: '1px solid #eaeaea',
  paddingTop: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 8px',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};
