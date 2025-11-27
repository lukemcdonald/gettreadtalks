import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { FooterInfo } from '@/components/site-footer/footer-info';
import { FooterNav } from '@/components/site-footer/footer-nav';

export function SiteFooter() {
  return (
    <footer className="bg-card" id="footer">
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
