import { Container } from '@/components/container';
import { FooterInfo } from '@/components/site-footer/footer-info';
import { FooterNav } from '@/components/site-footer/footer-nav';
import { Separator } from '@/components/ui/separator';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <Container className="py-8 sm:py-12">
        <FooterNav />
      </Container>

      <Separator />

      <Container>
        <FooterInfo />
      </Container>
    </footer>
  );
}
