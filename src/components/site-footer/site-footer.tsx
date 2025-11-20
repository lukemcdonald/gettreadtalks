import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { FooterInfo } from '@/components/site-footer/footer-info';
import { FooterNav } from '@/components/site-footer/footer-nav';
import { Separator } from '@/components/ui/separator';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <Section render={<div />} variant="xl">
        <Container>
          <FooterNav />
        </Container>
      </Section>

      <Separator />

      <Section render={<div />} variant="xl">
        <Container>
          <FooterInfo />
        </Container>
      </Section>
    </footer>
  );
}
