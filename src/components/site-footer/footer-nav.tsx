import { FooterColumn } from '@/components/site-footer/footer-column';
import { FooterLink } from '@/components/site-footer/footer-nav-link';

export function FooterNav() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <FooterColumn title="Engage">
        <FooterLink href="/talks">Talks</FooterLink>
        <FooterLink href="/speakers">Speakers</FooterLink>
        <FooterLink href="/collections">Collections</FooterLink>
        <FooterLink href="/clips">Clips</FooterLink>
      </FooterColumn>

      <FooterColumn title="General">
        <FooterLink href="/about">About</FooterLink>
        <FooterLink href="/beliefs">Beliefs</FooterLink>
        <FooterLink href="/contact">Contact</FooterLink>
      </FooterColumn>

      <FooterColumn title="Resources">
        <FooterLink href="/resources/bibles">Bibles</FooterLink>
        <FooterLink href="/resources/bible-app">Bible App</FooterLink>
        <FooterLink href="/resources/bible-study-tools">Bible Study Tools</FooterLink>
      </FooterColumn>
    </div>
  );
}
