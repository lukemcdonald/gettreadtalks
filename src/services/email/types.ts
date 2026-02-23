export interface EmailTemplateProps {
  email: string;
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
