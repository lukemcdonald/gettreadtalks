import { FooterInfo } from '@/components/site-footer/footer-info';
import { FooterNav } from '@/components/site-footer/footer-nav';
import { Container, Section } from '@/components/ui';

export function SiteFooter() {
  return (
    <footer id="footer">
      <Section render={<div />} spacing="xl">
        <Container>
          <FooterNav />
        </Container>
      </Section>

      <Section render={<div />} spacing="lg">
        <Container>
          <FooterInfo />
        </Container>
      </Section>
    </footer>
  );
}
