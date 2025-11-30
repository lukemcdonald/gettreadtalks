import { FooterColumn } from '@/components/site-footer/footer-column';
import { FooterLink } from '@/components/site-footer/footer-nav-link';

export function FooterNav() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
      <FooterColumn title="Engage">
        <FooterLink href="/talks">Talks</FooterLink>
        <FooterLink href="/speakers">Speakers</FooterLink>
        <FooterLink href="/collections">Collections</FooterLink>
        <FooterLink href="/clips">Clips</FooterLink>
      </FooterColumn>

      <FooterColumn title="General">
        <FooterLink href="/about">About</FooterLink>
        <FooterLink href="/beliefs">Beliefs</FooterLink>
        <FooterLink href="mailto:contact@gettreadtalks.com">Contact</FooterLink>
      </FooterColumn>

      <FooterColumn title="Resources">
        <FooterLink href="https://www.crossway.org/bibles/">Bibles</FooterLink>
        <FooterLink href="https://apps.apple.com/us/app/esv-bible/id361797273">
          Bible App
        </FooterLink>
        <FooterLink href="https://www.logos.com/">Bible Study Tools</FooterLink>
      </FooterColumn>
    </div>
  );
}
