export interface EmailTemplateProps {
  email: string;
}

export interface MediaHealthEmailItem {
  adminPath: string;
  entityTable: 'clips' | 'talks';
  firstBrokenAt: number;
  mediaUrl: string;
  newStatus: 'missing' | 'private';
  publicPath: string | null;
  title: string;
}

export interface MediaHealthEmailProps {
  items: MediaHealthEmailItem[];
  siteUrl: string;
  stillOpenCount: number;
  stillOpenHref: string;
}

export type PasswordResetEmailProps = EmailTemplateProps & {
  resetUrl: string;
  token: string;
};

export type VerificationEmailProps = EmailTemplateProps & {
  token: string;
  verificationUrl: string;
};

export type WelcomeEmailProps = EmailTemplateProps & {
  name: string;
  siteUrl: string;
};
