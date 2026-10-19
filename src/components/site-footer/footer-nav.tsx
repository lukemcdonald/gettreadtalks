import { FooterColumn } from '@/components/site-footer/footer-column';
import { FooterLink } from '@/components/site-footer/footer-link';
import { site } from '@/configs/site';
import { buildClipsPath } from '@/features/clips/utils';
import { buildCollectionsPath } from '@/features/collections/utils';
import { buildSpeakersPath } from '@/features/speakers/utils';
import { buildTalksPath } from '@/features/talks/utils';

export function FooterNav() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
      <FooterColumn title="Engage">
        <FooterLink href={buildTalksPath()}>Talks</FooterLink>
        <FooterLink href={buildSpeakersPath()}>Speakers</FooterLink>
        <FooterLink href={buildCollectionsPath()}>Collections</FooterLink>
        <FooterLink href={buildClipsPath()}>Clips</FooterLink>
      </FooterColumn>

      <FooterColumn title="General">
        <FooterLink href="/about">About</FooterLink>
        <FooterLink href="/beliefs">Beliefs</FooterLink>
        <FooterLink href="/ai">Use with AI</FooterLink>
        <FooterLink href={`mailto:${site.email.contact}`}>Contact</FooterLink>
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
